/**
 * API Gateway com WebSocket
 * Centraliza requisições para serviços internos e implementa WebSocket
 */

const express = require('express');
const expressWs = require('express-ws');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const wsInstance = expressWs(app);

const PORT = process.env.PORT || 3000;

// Armazenar conexões ativas de chat
const chatClients = new Map(); // Map<ws, {username, id}>
let clientIdCounter = 0;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de status da API
app.get('/api', (req, res) => {
  const wsProtocol = req.protocol === 'https' ? 'wss' : 'ws';
  
  res.json({
    message: 'Chat em Tempo Real - WebSocket',
    status: 'online',
    users: chatClients.size,
    websocket: `${wsProtocol}://${req.get('host')}/ws`,
    documentation: '/docs'
  });
});

// Função para broadcast de mensagem para todos os clientes
function broadcastMessage(message, excludeWs = null) {
  chatClients.forEach((client, ws) => {
    if (ws !== excludeWs && ws.readyState === 1) { // 1 = OPEN
      ws.send(JSON.stringify(message));
    }
  });
}

// Função para enviar lista de usuários online
function broadcastUserList() {
  const users = Array.from(chatClients.values()).map(client => ({
    id: client.id,
    username: client.username
  }));
  
  const message = {
    type: 'userList',
    users: users,
    count: users.length
  };
  
  chatClients.forEach((client, ws) => {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify(message));
    }
  });
}

// WebSocket Endpoint - Chat em Tempo Real
app.ws('/ws', (ws, req) => {
  const clientId = ++clientIdCounter;
  let username = null;
  
  console.log(`[Chat] Nova conexão (ID: ${clientId})`);
  
  // Mensagem de boas-vindas
  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Bem-vindo ao Chat em Tempo Real! Por favor, escolha um nome de usuário.',
    clientId: clientId
  }));

  // Receber mensagens do cliente
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      
      // Definir nome de usuário
      if (data.type === 'setUsername') {
        const newUsername = data.username.trim();
        
        // Verificar se o nome já está em uso
        const usernameExists = Array.from(chatClients.values())
          .some(client => client.username === newUsername);
        
        if (usernameExists) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Este nome de usuário já está em uso. Escolha outro.'
          }));
          return;
        }
        
        if (newUsername.length < 2 || newUsername.length > 20) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'O nome deve ter entre 2 e 20 caracteres.'
          }));
          return;
        }
        
        username = newUsername;
        chatClients.set(ws, { username, id: clientId });
        
        console.log(`[Chat] Usuário "${username}" (ID: ${clientId}) entrou no chat`);
        
        // Confirmar para o usuário
        ws.send(JSON.stringify({
          type: 'usernameAccepted',
          username: username
        }));
        
        // Notificar todos sobre novo usuário
        broadcastMessage({
          type: 'userJoined',
          username: username,
          message: `${username} entrou no chat`,
          timestamp: new Date().toISOString()
        });
        
        // Enviar lista atualizada de usuários
        broadcastUserList();
        
        return;
      }
      
      // Processar mensagens de chat
      if (data.type === 'message') {
        if (!username) {
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Você precisa definir um nome de usuário primeiro.'
          }));
          return;
        }
        
        const chatMessage = {
          type: 'message',
          username: username,
          userId: clientId,
          message: data.message,
          timestamp: new Date().toISOString()
        };
        
        console.log(`[Chat] ${username}: ${data.message}`);
        
        // Enviar para todos (incluindo o remetente)
        chatClients.forEach((client, clientWs) => {
          if (clientWs.readyState === 1) {
            clientWs.send(JSON.stringify(chatMessage));
          }
        });
      }
      
      // Comando para listar usuários
      if (data.type === 'listUsers') {
        broadcastUserList();
      }
      
    } catch (e) {
      console.error('[Chat] Erro ao processar mensagem:', e);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Erro ao processar sua mensagem.'
      }));
    }
  });

  // Evento de desconexão
  ws.on('close', () => {
    if (username) {
      console.log(`[Chat] Usuário "${username}" (ID: ${clientId}) saiu do chat`);
      
      chatClients.delete(ws);
      
      // Notificar todos sobre saída do usuário
      broadcastMessage({
        type: 'userLeft',
        username: username,
        message: `${username} saiu do chat`,
        timestamp: new Date().toISOString()
      });
      
      // Enviar lista atualizada de usuários
      broadcastUserList();
    } else {
      console.log(`[Chat] Conexão (ID: ${clientId}) encerrada sem usuário definido`);
      chatClients.delete(ws);
    }
  });

  // Evento de erro
  ws.on('error', (error) => {
    console.error(`[Chat] Erro (ID: ${clientId}):`, error);
    chatClients.delete(ws);
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║           💬 Chat em Tempo Real - WebSocket               ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Chat Web: http://localhost:${PORT}                      ║`);
  console.log(`║  🔌 WebSocket: ws://localhost:${PORT}/ws                    ║`);
  console.log(`║  📚 Docs: http://localhost:${PORT}/docs                     ║`);
  console.log(`║  📊 Status: http://localhost:${PORT}/api                    ║`);
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n✅ Servidor pronto! Abra múltiplas abas para testar o chat.\n');
});
