/**
 * Service B - API de Mensagens
 * Simula um serviço interno de histórico de mensagens
 */

const messages = [
  { id: 1, user: 'João', text: 'Olá pessoal!', timestamp: '2025-12-04T10:00:00Z' },
  { id: 2, user: 'Maria', text: 'Tudo bem?', timestamp: '2025-12-04T10:01:00Z' },
  { id: 3, user: 'Pedro', text: 'Ótimo dia!', timestamp: '2025-12-04T10:02:00Z' }
];

function getAllMessages() {
  return {
    service: 'messages-api',
    data: messages,
    count: messages.length
  };
}

function getRecentMessages(limit = 10) {
  return {
    service: 'messages-api',
    data: messages.slice(-limit),
    count: Math.min(limit, messages.length)
  };
}

module.exports = {
  getAllMessages,
  getRecentMessages
};
