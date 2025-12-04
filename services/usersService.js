/**
 * Service A - API de Usuários
 * Simula um serviço interno de gerenciamento de usuários
 */

const users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'active' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'inactive' }
];

function getAllUsers() {
  return {
    service: 'users-api',
    data: users,
    count: users.length
  };
}

function getUserById(id) {
  const user = users.find(u => u.id === parseInt(id));
  return {
    service: 'users-api',
    data: user || null,
    found: !!user
  };
}

module.exports = {
  getAllUsers,
  getUserById
};
