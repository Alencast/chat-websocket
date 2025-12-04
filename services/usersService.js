/**
 * Service A - API de Usuários
 * Simula um serviço interno de gerenciamento de usuários
 */

// Base de dados mockada de usuários (somente em memória).
const users = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', status: 'active' },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', status: 'active' },
  { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', status: 'inactive' }
];

// Retorna todos os usuários cadastrados e metadados.
function getAllUsers() {
  return {
    service: 'users-api',
    data: users,
    count: users.length
  };
}

// Busca usuário pelo ID (number) e informa se foi encontrado.
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
