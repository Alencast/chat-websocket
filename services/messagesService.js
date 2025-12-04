/**
 * Service B - API de Mensagens
 * Armazena histórico real de mensagens do chat
 */

// Histórico de mensagens do chat (em memória, atualizado em tempo real).
const messages = [];
let messageIdCounter = 0;

// Adiciona uma nova mensagem ao histórico (chamado pelo gateway).
function addMessage(username, userId, text) {
  const message = {
    id: ++messageIdCounter,
    userId: userId,
    username: username,
    text: text,
    timestamp: new Date().toISOString()
  };
  messages.push(message);
  return message;
}

// Retorna todo o histórico de mensagens e metadados.
function getAllMessages() {
  return {
    service: 'messages-api',
    data: messages,
    count: messages.length,
    note: 'Histórico completo de mensagens do chat'
  };
}

// Retorna as últimas `limit` mensagens do histórico.
function getRecentMessages(limit = 10) {
  return {
    service: 'messages-api',
    data: messages.slice(-limit),
    count: Math.min(limit, messages.length),
    note: `Últimas ${Math.min(limit, messages.length)} mensagens`
  };
}

module.exports = {
  getAllMessages,
  getRecentMessages,
  addMessage
};
