let ws = null;
let currentUsername = null;
let myUserId = null;

// Retorna hora atual em formato HH:MM (pt-BR) para exibir nas mensagens.
function getTime() {
  const now = new Date();
  return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Atualiza indicador visual de status da conexão (conectado/desconectado).
function updateStatus(connected) {
  const statusDiv = document.getElementById('status');
  if (connected) {
    statusDiv.className = 'status connected';
    statusDiv.textContent = '● Conectado';
  } else {
    statusDiv.className = 'status disconnected';
    statusDiv.textContent = '● Desconectado';
  }
}

// Adiciona mensagens do sistema (eventos como join/leave/erros) na área de mensagens.
function addSystemMessage(text) {
  const messagesDiv = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'system-message';
  messageDiv.textContent = text;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Renderiza uma mensagem de chat na UI.
// isOwn controla estilo diferenciado para mensagens do próprio usuário.
function addChatMessage(username, message, isOwn, userId) {
  const messagesDiv = document.getElementById('messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const messageHeader = document.createElement('div');
  messageHeader.className = 'message-header';

  const usernameSpan = document.createElement('span');
  usernameSpan.className = 'message-username';
  usernameSpan.textContent = isOwn ? 'Você' : username;

  const timeSpan = document.createElement('span');
  timeSpan.className = 'message-time';
  timeSpan.textContent = getTime();

  messageHeader.appendChild(usernameSpan);
  messageHeader.appendChild(timeSpan);

  const messageText = document.createElement('div');
  messageText.className = 'message-text';
  messageText.textContent = message;

  messageContent.appendChild(messageHeader);
  messageContent.appendChild(messageText);
  messageDiv.appendChild(messageContent);

  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Atualiza a sidebar com a lista de usuários online.
function updateUsersList(users) {
  const usersList = document.getElementById('usersList');
  usersList.innerHTML = '';

  if (users.length === 0) {
    usersList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum usuário conectado</p>';
    return;
  }

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user-item';

    const avatar = document.createElement('div');
    avatar.className = 'user-avatar';
    avatar.textContent = user.username.charAt(0).toUpperCase();

    const name = document.createElement('div');
    name.className = 'user-name';
    name.textContent = user.username + (user.id === myUserId ? ' (Você)' : '');

    const dot = document.createElement('div');
    dot.className = 'online-dot';

    userDiv.appendChild(avatar);
    userDiv.appendChild(name);
    userDiv.appendChild(dot);

    usersList.appendChild(userDiv);
  });
}

// Abre conexão WebSocket e registra handlers de evento.
function connectWebSocket() {
  const wsUrl = `ws://${window.location.host}/ws`;

  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = function() {
      console.log('Conectado ao servidor');
      updateStatus(true);
    };

    ws.onmessage = function(event) {
      try {
        const data = JSON.parse(event.data);

        switch(data.type) {
          case 'welcome':
            myUserId = data.clientId;
            break;

          case 'usernameAccepted':
            currentUsername = data.username;
            document.getElementById('usernameModal').classList.remove('show');
            document.getElementById('messageInput').disabled = false;
            document.getElementById('btnSend').disabled = false;
            addSystemMessage(`Bem-vindo ao chat, ${currentUsername}!`);
            break;

          case 'error':
            if (!currentUsername) {
              document.getElementById('usernameError').textContent = data.message;
            } else {
              addSystemMessage('❌ ' + data.message);
            }
            break;

          case 'message':
            const isOwn = data.userId === myUserId;
            addChatMessage(data.username, data.message, isOwn, data.userId);
            break;

          case 'userJoined':
            addSystemMessage(`👋 ${data.username} entrou no chat`);
            break;

          case 'userLeft':
            addSystemMessage(`👋 ${data.username} saiu do chat`);
            break;

          case 'userList':
            updateUsersList(data.users);
            break;
        }
      } catch (e) {
        console.error('Erro ao processar mensagem:', e);
      }
    };

    ws.onerror = function(error) {
      console.error('Erro WebSocket:', error);
      addSystemMessage('❌ Erro na conexão');
    };

    ws.onclose = function() {
      console.log('Conexão encerrada');
      updateStatus(false);
      ws = null;
      addSystemMessage('Conexão perdida. Recarregue a página para reconectar.');
    };
  } catch (error) {
    console.error('Erro ao conectar:', error);
    addSystemMessage('❌ Erro ao conectar ao servidor');
  }
}

// Envia ao servidor o nome de usuário escolhido após validação local.
function setUsername() {
  const input = document.getElementById('usernameInput');
  const username = input.value.trim();
  const errorDiv = document.getElementById('usernameError');

  errorDiv.textContent = '';

  if (!username) {
    errorDiv.textContent = 'Por favor, digite um nome de usuário';
    return;
  }

  if (username.length < 2 || username.length > 20) {
    errorDiv.textContent = 'O nome deve ter entre 2 e 20 caracteres';
    return;
  }

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'setUsername',
      username: username
    }));
  }
}

// Envia uma mensagem de chat via WebSocket.
function sendMessage() {
  const input = document.getElementById('messageInput');
  const message = input.value.trim();

  if (!message) {
    return;
  }

  if (!ws || ws.readyState !== WebSocket.OPEN) {
    addSystemMessage('❌ Não conectado ao servidor');
    return;
  }

  try {
    ws.send(JSON.stringify({
      type: 'message',
      message: message
    }));
    input.value = '';
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    addSystemMessage('❌ Erro ao enviar mensagem');
  }
}

// Enter para enviar mensagem
const messageInputEl = document.getElementById('messageInput');
messageInputEl && messageInputEl.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// Enter para definir nome de usuário
const usernameInputEl = document.getElementById('usernameInput');
usernameInputEl && usernameInputEl.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    setUsername();
  }
});

// Conectar automaticamente ao carregar
window.addEventListener('load', function() {
  connectWebSocket();
});
