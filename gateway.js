/**
 * API Gateway com WebSocket
 * Centraliza requisições para serviços internos e implementa WebSocket
 */

const express = require('express');
const expressWs = require('express-ws');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const usersService = require('./services/usersService');
const messagesService = require('./services/messagesService');

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

// HATEOAS - Endpoint raiz da API Gateway
app.get('/api', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const wsProtocol = req.protocol === 'https' ? 'wss' : 'ws';
  
  res.json({
    message: 'API Gateway - Chat WebSocket com Microserviços',
    version: '1.0.0',
    status: 'online',
    activeUsers: chatClients.size,
    _links: {
      self: {
        href: `${baseUrl}/api`,
        method: 'GET',
        description: 'Endpoint raiz com HATEOAS'
      },
      users: {
        href: `${baseUrl}/api/users`,
        method: 'GET',
        description: 'API de Usuários (Service A)'
      },
      userById: {
        href: `${baseUrl}/api/users/{id}`,
        method: 'GET',
        description: 'Buscar usuário por ID',
        templated: true
      },
      messages: {
        href: `${baseUrl}/api/messages`,
        method: 'GET',
        description: 'API de Mensagens (Service B)'
      },
      recentMessages: {
        href: `${baseUrl}/api/messages/recent`,
        method: 'GET',
        description: 'Buscar mensagens recentes'
      },
      chat: {
        href: `${baseUrl}/`,
        method: 'GET',
        description: 'Interface web do chat'
      },
      websocket: {
        href: `${wsProtocol}://${req.get('host')}/ws`,
        protocol: 'websocket',
        description: 'Endpoint WebSocket para chat em tempo real'
      },
      documentation: {
        href: `${baseUrl}/docs`,
        method: 'GET',
        description: 'Documentação Swagger da API'
      }
    }
  });
});

// API Gateway - Rota para Service A (Usuários)
app.get('/api/users', (req, res) => {
  console.log('[Gateway] → Service A: Requisição para listar usuários');
  const data = usersService.getAllUsers();
  res.json(data);
});

app.get('/api/users/:id', (req, res) => {
  console.log(`[Gateway] → Service A: Requisição para usuário ID ${req.params.id}`);
  const data = usersService.getUserById(req.params.id);
  
  if (!data.found) {
    return res.status(404).json({
      error: 'Usuário não encontrado',
      service: 'users-api'
    });
  }
  
  res.json(data);
});

// API Gateway - Rota para Service B (Mensagens)
app.get('/api/messages', (req, res) => {
  console.log('[Gateway] → Service B: Requisição para listar mensagens');
  const data = messagesService.getAllMessages();
  res.json(data);
});

app.get('/api/messages/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  console.log(`[Gateway] → Service B: Requisição para ${limit} mensagens recentes`);
  const data = messagesService.getRecentMessages(limit);
  res.json(data);
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

// Função para obter IP local
function getLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Iniciar servidor em todas as interfaces (0.0.0.0)
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║        🚀 API Gateway + WebSocket - Servidor Ativo        ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log('║  🖥️  Acesso Local:                                        ║');
  console.log(`║     http://localhost:${PORT}                                ║`);
  console.log('║                                                           ║');
  console.log('║  🌐 Acesso na Rede:                                       ║');
  console.log(`║     http://${localIP}:${PORT}${' '.repeat(39 - localIP.length)}║`);
  console.log('║                                                           ║');
  console.log('║  📄 Endpoints REST (HATEOAS):                             ║');
  console.log(`║     • Gateway: http://localhost:${PORT}/api                 ║`);
  console.log(`║     • Usuários: http://localhost:${PORT}/api/users          ║`);
  console.log(`║     • Mensagens: http://localhost:${PORT}/api/messages      ║`);
  console.log('║                                                           ║');
  console.log('║  🔌 WebSocket:                                            ║');
  console.log(`║     • Endpoint: ws://localhost:${PORT}/ws                   ║`);
  console.log('║                                                           ║');
  console.log('║  📚 Documentação:                                         ║');
  console.log(`║     • Swagger: http://localhost:${PORT}/docs                ║`);
  console.log('║                                                           ║');
  console.log('║  💬 Cliente Web:                                          ║');
  console.log(`║     • Chat: http://localhost:${PORT}/                       ║`);
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('\n✅ Servidor pronto!');
  console.log(`📱 Compartilhe com outros na rede: http://${localIP}:${PORT}\n`);
});
