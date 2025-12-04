/**
 * Service A - API de Usuários
 * Retorna usuários conectados em tempo real via WebSocket
 */

// Lista de usuários conectados no chat (atualizada pelo gateway).
let connectedUsers = [];

// Atualiza a lista de usuários conectados (chamado pelo gateway).
function setConnectedUsers(users) {
  connectedUsers = users;
}

// Retorna todos os usuários conectados no chat.
function getAllUsers() {
  return {
    service: 'users-api',
    data: connectedUsers,
    count: connectedUsers.length,
    note: 'Usuários conectados em tempo real via WebSocket'
  };
}

// Busca usuário conectado pelo ID.
function getUserById(id) {
  const user = connectedUsers.find(u => u.id === parseInt(id));
  return {
    service: 'users-api',
    data: user || null,
    found: !!user
  };
}

module.exports = {
  getAllUsers,
  getUserById,
  setConnectedUsers
};
