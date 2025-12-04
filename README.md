# 🚀 Chat WebSocket - API Gateway com Microserviços

Projeto completo demonstrando **transmissão de dados com WebSocket** integrado a um **API Gateway** que centraliza o acesso a dois microserviços internos. Implementa **HATEOAS**, documentação **Swagger** e um **cliente web** para chat em tempo real.

## 📋 Sobre o Projeto

Este projeto implementa um estudo de caso de **transmissão de dados usando WebSocket** em uma arquitetura de microserviços, atendendo todos os requisitos:

### ✅ Requisitos Implementados

#### **Regras API Gateway:**
- ✅ **API Gateway desenvolvido**: Gateway centralizado que roteia requisições para serviços internos
- ✅ **HATEOAS implementado**: Endpoint `/api` retorna links navegáveis para todos os recursos
- ✅ **Documentação da API**: Interface Swagger completa em `/docs`
- ✅ **2 APIs internas simuladas**:
  - **Service A**: API de Usuários (gerenciamento de usuários)
  - **Service B**: API de Mensagens (histórico de mensagens)
- ✅ **Cliente Web desenvolvido**: Interface HTML/JS/CSS para acessar o Gateway e WebSocket

#### **Regras WebSocket:**
- ✅ **Servidor WebSocket**: Classe que fornece endpoint `/ws` e gerencia ciclo de vida completo
- ✅ **Cliente WebSocket**: Objeto WebSocket instanciado no navegador com gerenciamento de ciclo de vida (conexão, mensagens, erros, desconexão)

### 🎯 Funcionalidades

- **Chat em tempo real**: Múltiplos usuários conversando simultaneamente
- **API Gateway com HATEOAS**: Navegação completa da API através de hypermedia
- **Microserviços internos**: Arquitetura com dois serviços independentes
- **Documentação Swagger**: API totalmente documentada e testável
- **Cliente Web interativo**: Interface moderna para testar WebSocket
- **Acesso em rede local**: Permite chat entre dispositivos na mesma rede

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE WEB (Browser)                   │
│  - Interface HTML/CSS/JS                                    │
│  - Objeto WebSocket gerenciando ciclo de vida              │
│  - Conexão/Reconexão/Envio/Recebimento de mensagens        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTP/WebSocket
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY (gateway.js)                │
│  - Roteamento centralizado                                  │
│  - Endpoint WebSocket (/ws) com gerenciamento completo     │
│  - HATEOAS (/api) com links navegáveis                     │
│  - Documentação Swagger (/docs)                            │
└────────┬──────────────────────────────┬─────────────────────┘
         │                              │
         │ Integração                   │ Integração
         ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│   SERVICE A          │      │   SERVICE B          │
│   (usersService.js)  │      │ (messagesService.js) │
│                      │      │                      │
│ - API de Usuários    │      │ - API de Mensagens   │
│ - GET /api/users     │      │ - GET /api/messages  │
│ - GET /api/users/:id │      │ - GET /api/messages/ │
│                      │      │         recent       │
└──────────────────────┘      └──────────────────────┘
```

### 📁 Estrutura de Arquivos

```
chat-websocket/
│
├── gateway.js                    # API Gateway + Servidor WebSocket
├── services/
│   ├── usersService.js          # Service A - API de Usuários
│   └── messagesService.js       # Service B - API de Mensagens
├── public/
│   └── index.html               # Cliente Web (HTML/CSS/JS puro)
├── swagger.json                 # Documentação OpenAPI/Swagger
├── package.json                 # Dependências do projeto
├── .gitignore                   # Arquivos ignorados pelo Git
└── README.md                    # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **express-ws** - Suporte a WebSocket para Express
- **swagger-ui-express** - Interface Swagger para documentação
- **HTML/CSS/JavaScript puro** - Cliente web sem frameworks

## 📦 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente vem com Node.js)

### Passo a Passo

1. **Clone ou baixe este repositório**

2. **Instale as dependências:**

```bash
npm install
```

Isso instalará:
- express
- express-ws
- swagger-ui-express

## 🚀 Como Rodar o Projeto

### Iniciar o servidor:

```bash
npm start
```

Ou alternativamente:

```bash
node gateway.js
```

### Saída esperada:

```
╔═══════════════════════════════════════════════════════════╗
║        🚀 API Gateway + WebSocket - Servidor Ativo        ║
╠═══════════════════════════════════════════════════════════╣
║  🖥️  Acesso Local:                                        ║
║     http://localhost:3000                                ║
║                                                           ║
║  🌐 Acesso na Rede:                                       ║
║     http://192.168.1.10:3000                             ║
║                                                           ║
║  📄 Endpoints REST (HATEOAS):                             ║
║     • Gateway: http://localhost:3000/api                 ║
║     • Usuários: http://localhost:3000/api/users          ║
║     • Mensagens: http://localhost:3000/api/messages      ║
║                                                           ║
║  🔌 WebSocket:                                            ║
║     • Endpoint: ws://localhost:3000/ws                   ║
║                                                           ║
║  📚 Documentação:                                         ║
║     • Swagger: http://localhost:3000/docs                ║
║                                                           ║
║  💬 Cliente Web:                                          ║
║     • Chat: http://localhost:3000/                       ║
╚═══════════════════════════════════════════════════════════╝

✅ Servidor pronto!
📱 Compartilhe com outros na rede: http://192.168.1.10:3000
```

## 🧪 Como Testar

### 1. Testar o Cliente Web (Recomendado)

1. Abra o navegador e acesse: **http://localhost:3000**
2. Clique no botão **"Conectar"** para estabelecer conexão WebSocket
3. Digite uma mensagem no campo de texto
4. Clique em **"Enviar Mensagem"**
5. Observe as mensagens no log (enviadas e recebidas)

### 2. Testar os Endpoints REST (API Gateway)

#### HATEOAS - Endpoint raiz com links navegáveis:
```bash
curl http://localhost:3000/api
```

**Resposta esperada (HATEOAS):**
```json
{
  "message": "API Gateway - Chat WebSocket com Microserviços",
  "version": "1.0.0",
  "status": "online",
  "activeUsers": 0,
  "_links": {
    "self": {
      "href": "http://localhost:3000/api",
      "method": "GET",
      "description": "Endpoint raiz com HATEOAS"
    },
    "users": {
      "href": "http://localhost:3000/api/users",
      "method": "GET",
      "description": "API de Usuários (Service A)"
    },
    "userById": {
      "href": "http://localhost:3000/api/users/{id}",
      "method": "GET",
      "description": "Buscar usuário por ID",
      "templated": true
    },
    "messages": {
      "href": "http://localhost:3000/api/messages",
      "method": "GET",
      "description": "API de Mensagens (Service B)"
    },
    "recentMessages": {
      "href": "http://localhost:3000/api/messages/recent",
      "method": "GET",
      "description": "Buscar mensagens recentes"
    },
    "chat": {
      "href": "http://localhost:3000/",
      "method": "GET",
      "description": "Interface web do chat"
    },
    "websocket": {
      "href": "ws://localhost:3000/ws",
      "protocol": "websocket",
      "description": "Endpoint WebSocket para chat em tempo real"
    },
    "documentation": {
      "href": "http://localhost:3000/docs",
      "method": "GET",
      "description": "Documentação Swagger da API"
    }
  }
}
```

#### Service A - API de Usuários:
```bash
# Listar todos os usuários
curl http://localhost:3000/api/users

# Buscar usuário específico por ID
curl http://localhost:3000/api/users/1
```

**Resposta esperada:**
```json
{
  "service": "users-api",
  "data": [
    {
      "id": 1,
      "name": "João Silva",
      "email": "joao@email.com",
      "status": "active"
    },
    {
      "id": 2,
      "name": "Maria Santos",
      "email": "maria@email.com",
      "status": "active"
    }
  ],
  "count": 3
}
```

#### Service B - API de Mensagens:
```bash
# Listar todas as mensagens
curl http://localhost:3000/api/messages

# Buscar mensagens recentes (últimas 5)
curl http://localhost:3000/api/messages/recent?limit=5
```

**Resposta esperada:**
```json
{
  "service": "messages-api",
  "data": [
    {
      "id": 1,
      "user": "João",
      "text": "Olá pessoal!",
      "timestamp": "2025-12-04T10:00:00Z"
    }
  ],
  "count": 3
}
```

### 3. Testar WebSocket via Linha de Comando

Você pode usar ferramentas como **wscat** para testar o WebSocket:

```bash
# Instalar wscat globalmente (se necessário)
npm install -g wscat

# Conectar ao WebSocket
wscat -c ws://localhost:3000/ws

# Enviar mensagens
> Hello Server!
```

### 4. Testar WebSocket via JavaScript no Console do Navegador

```javascript
// Abra o console do navegador (F12) e execute:
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Conectado!');
  ws.send(JSON.stringify({ message: 'Hello from console!' }));
};

ws.onmessage = (event) => {
  console.log('Mensagem recebida:', event.data);
};
```

## 📚 Como Acessar o Swagger

1. Com o servidor rodando, abra o navegador
2. Acesse: **http://localhost:3000/docs**
3. Você verá a interface Swagger com toda a documentação da API
4. Pode testar os endpoints diretamente pela interface

A documentação Swagger inclui:
- Descrição completa de cada endpoint
- Schemas de requisição/resposta
- Exemplos de uso
- Informações sobre o WebSocket na seção `x-websocket`

## 🔍 Como Acessar os Serviços

### Via Navegador:
- **Cliente Web (Chat)**: http://localhost:3000/
- **Gateway HATEOAS**: http://localhost:3000/api
- **Service A (Usuários)**: http://localhost:3000/api/users
- **Service A (Usuário por ID)**: http://localhost:3000/api/users/1
- **Service B (Mensagens)**: http://localhost:3000/api/messages
- **Service B (Mensagens Recentes)**: http://localhost:3000/api/messages/recent?limit=5
- **Swagger Docs**: http://localhost:3000/docs

### Via cURL (Terminal):
```bash
# Gateway com HATEOAS
curl http://localhost:3000/api

# Service A - Usuários
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1

# Service B - Mensagens
curl http://localhost:3000/api/messages
curl http://localhost:3000/api/messages/recent?limit=5
```

### Via Postman/Insomnia:
Importe as URLs acima como requisições GET ou use a documentação Swagger.

## 🎯 Funcionalidades do WebSocket

O endpoint WebSocket (`/ws`) implementa:

1. **Mensagem de boas-vindas**: Ao conectar, o servidor envia uma mensagem de boas-vindas
2. **Echo inteligente**: Mensagens enviadas são retornadas com metadados
3. **Suporte a JSON**: Detecta e processa mensagens em formato JSON
4. **Logging**: Todas as conexões e mensagens são registradas no console do servidor
5. **Tratamento de erros**: Gerenciamento adequado de erros e desconexões

### Formato das Mensagens

**Mensagem de conexão:**
```json
{
  "type": "connection",
  "message": "Bem-vindo ao WebSocket Server!",
  "timestamp": "2025-12-04T10:30:00.000Z"
}
```

**Echo de mensagem:**
```json
{
  "type": "echo",
  "original": { "text": "Hello", "timestamp": "..." },
  "timestamp": "2025-12-04T10:30:05.000Z",
  "message": "Mensagem recebida e processada com sucesso"
}
```

## 🛠️ Logs do Servidor

Ao executar o projeto, você verá logs no terminal:

```
[Gateway] Requisição recebida para Service A
[WebSocket] Nova conexão estabelecida
[WebSocket] Mensagem recebida: {"text":"Hello","timestamp":"..."}
[WebSocket] Conexão encerrada
```

## 📝 Notas Importantes

- O servidor roda na porta **3000** por padrão
- Para alterar a porta, defina a variável de ambiente `PORT`
- O WebSocket usa o protocolo `ws://` (não criptografado)
- Em produção, considere usar `wss://` com HTTPS
- Não há persistência de dados (tudo é em memória)
- Não há autenticação implementada (apenas para demonstração)

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
npm install
```

### Erro: "Port 3000 is already in use"
```bash
# No Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou altere a porta:
set PORT=3001
npm start
```

### WebSocket não conecta
- Verifique se o servidor está rodando
- Certifique-se de usar `ws://` e não `http://`
- Verifique firewalls ou bloqueios de rede

## 📖 Conceitos Demonstrados

### HATEOAS (Hypermedia as the Engine of Application State)
O endpoint `/api` retorna links para todos os recursos disponíveis, permitindo que clientes descubram a API dinamicamente.

### API Gateway Pattern
Centraliza o acesso aos serviços internos, fornecendo um ponto único de entrada.

### WebSocket Protocol
Comunicação bidirecional em tempo real, mantendo conexões persistentes.

### Documentação OpenAPI/Swagger
Especificação padrão da indústria para documentar APIs REST.


