/**
 * Consumidor RabbitMQ - Processo Separado
 * Consome mensagens da fila 'chat.mensagens' e as processa
 */

const amqp = require('amqplib');
const fs = require('fs');
const path = require('path');

const QUEUE_NAME = 'chat.mensagens';
const LOG_FILE = path.join(__dirname, 'mensagens-consumidas.log');

// Conecta ao RabbitMQ e inicia consumo da fila.
async function startConsumer() {
  try {
    console.log('[Consumidor] Iniciando...');
    
    // Conecta ao RabbitMQ
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    // Declara a fila (garante que existe)
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    console.log(`[Consumidor] Aguardando mensagens na fila '${QUEUE_NAME}'...`);
    console.log(`[Consumidor] Mensagens serão salvas em: ${LOG_FILE}`);
    console.log('[Consumidor] Pressione CTRL+C para sair\n');
    
    // Configura prefetch pra processar 1 mensagem por vez
    channel.prefetch(1);
    
    // Consome mensagens da fila
    channel.consume(QUEUE_NAME, (msg) => {
      if (msg !== null) {
        // Decodifica a mensagem de json pra obj
        const content = msg.content.toString();
        const message = JSON.parse(content);
        
        // imprime a msg no console
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`[Consumidor] Nova mensagem recebida:`);
        console.log(`  Usuário: ${message.username} (ID: ${message.userId})`);
        console.log(`  Mensagem: ${message.message}`);
        console.log(`  Timestamp: ${message.timestamp}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Salva em arquivo de log
        const logEntry = `[${message.timestamp}] ${message.username}: ${message.message}\n`;
        fs.appendFileSync(LOG_FILE, logEntry);
        
        // Confirma
        channel.ack(msg);
      }
    });
    
    // Trata encerramento
    process.on('SIGINT', async () => {
      console.log('\n[Consumidor] Encerrando...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[Consumidor] Erro:', error.message);
    process.exit(1);
  }
}

// Inicia o consumidor
startConsumer();
