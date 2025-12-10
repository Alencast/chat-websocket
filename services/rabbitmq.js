/**
 * Serviço de integração com RabbitMQ
 * Gerencia conexão, canal e operações de fila
 */

const amqp = require('amqplib');

let connection = null;
let channel = null;
const QUEUE_NAME = 'chat.mensagens';

// Conecta ao RabbitMQ e cria o canal
async function connect() {
  try {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    
    // Declara a fila (se não existir, cria)
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    console.log('[RabbitMQ] Conectado com sucesso');
    console.log(`[RabbitMQ] Fila '${QUEUE_NAME}' pronta`);
    
    return true;
  } catch (error) {
    console.error('[RabbitMQ] Erro ao conectar:', error.message);
    return false;
  }
}

// Publica mensagem na fila (o produtor).
async function publishMessage(message) {
  try {
    if (!channel) {
      console.error('[RabbitMQ] Canal não inicializado');
      return false;
    }
    
    const messageBuffer = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(QUEUE_NAME, messageBuffer, { persistent: true });
    
    console.log(`[RabbitMQ] Mensagem publicada: ${message.username} - ${message.message}`);
    return true;
  } catch (error) {
    console.error('[RabbitMQ] Erro ao publicar:', error.message);
    return false;
  }
}

// Fecha conexão com o RabbitMQ.
async function close() {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    console.log('[RabbitMQ] Conexão fechada');
  } catch (error) {
    console.error('[RabbitMQ] Erro ao fechar:', error.message);
  }
}

module.exports = {
  connect,
  publishMessage,
  close,
  QUEUE_NAME
};
