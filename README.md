# 🚀 Chat WebSocket - API Gateway

Projeto de demonstração de um **API Gateway** integrado com **WebSocket**, implementando **HATEOAS** e integrando dois serviços internos simples. O projeto utiliza Node.js, Express, WebSocket e Swagger para documentação.

## 📋 Descrição do Projeto

Este projeto demonstra:

- **API Gateway centralizado**: Roteia requisições para serviços internos
- **WebSocket em tempo real**: Comunicação bidirecional entre cliente e servidor
- **HATEOAS**: Navegabilidade da API através de hypermedia
- **Swagger/OpenAPI**: Documentação interativa da API
- **Cliente Web**: Interface HTML/JS para testar o WebSocket
- **Arquitetura de Microserviços**: Dois serviços internos (A e B)

## 🏗️ Estrutura do Projeto

```
chat-websocket/
│
├── gateway.js                 # API Gateway principal com WebSocket
├── services/
│   ├── serviceA.js           # Serviço interno A
│   └── serviceB.js           # Serviço interno B
├── public/
│   └── index.html            # Cliente web para testar WebSocket
├── swagger.json              # Documentação OpenAPI/Swagger
├── package.json              # Dependências do projeto
└── README.md                 # Este arquivo
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
║         API Gateway com WebSocket - Servidor Ativo        ║
╠═══════════════════════════════════════════════════════════╣
║  Servidor rodando em: http://localhost:3000              ║
║                                                           ║
║  📄 Endpoints REST:                                       ║
║     • HATEOAS: http://localhost:3000/api                 ║
║     • Service A: http://localhost:3000/api/service-a     ║
║     • Service B: http://localhost:3000/api/service-b     ║
║                                                           ║
║  🔌 WebSocket:                                            ║
║     • Endpoint: ws://localhost:3000/ws                   ║
║                                                           ║
║  📚 Documentação:                                         ║
║     • Swagger UI: http://localhost:3000/docs             ║
║                                                           ║
║  🌐 Cliente Web:                                          ║
║     • Interface: http://localhost:3000/                  ║
╚═══════════════════════════════════════════════════════════╝
```

## 🧪 Como Testar

### 1. Testar o Cliente Web (Recomendado)

1. Abra o navegador e acesse: **http://localhost:3000**
2. Clique no botão **"Conectar"** para estabelecer conexão WebSocket
3. Digite uma mensagem no campo de texto
4. Clique em **"Enviar Mensagem"**
5. Observe as mensagens no log (enviadas e recebidas)

### 2. Testar os Endpoints REST

#### HATEOAS - Endpoint raiz:
```bash
curl http://localhost:3000/api
```

**Resposta esperada:**
```json
{
  "message": "API Gateway - WebSocket Demo",
  "links": {
    "self": {
      "href": "/api",
      "method": "GET"
    },
    "service-a": {
      "href": "/api/service-a",
      "method": "GET",
      "description": "Consulta o Service A"
    },
    "service-b": {
      "href": "/api/service-b",
      "method": "GET",
      "description": "Consulta o Service B"
    },
    "websocket": {
      "href": "ws://localhost:3000/ws",
      "protocol": "websocket",
      "description": "Conexão WebSocket para comunicação em tempo real"
    },
    "documentation": {
      "href": "/docs",
      "method": "GET",
      "description": "Documentação Swagger da API"
    }
  }
}
```

#### Service A:
```bash
curl http://localhost:3000/api/service-a
```

**Resposta esperada:**
```json
{
  "service": "A",
  "status": "ok"
}
```

#### Service B:
```bash
curl http://localhost:3000/api/service-b
```

**Resposta esperada:**
```json
{
  "service": "B",
  "status": "ok"
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
- **Cliente Web**: http://localhost:3000/
- **HATEOAS**: http://localhost:3000/api
- **Service A**: http://localhost:3000/api/service-a
- **Service B**: http://localhost:3000/api/service-b
- **Swagger**: http://localhost:3000/docs

### Via cURL (Terminal):
```bash
# HATEOAS
curl http://localhost:3000/api

# Service A
curl http://localhost:3000/api/service-a

# Service B
curl http://localhost:3000/api/service-b
```

### Via Postman/Insomnia:
Importe as URLs acima como requisições GET.

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

## 🚀 Próximos Passos (Melhorias Possíveis)

- Adicionar autenticação JWT
- Implementar rate limiting
- Adicionar mais serviços internos
- Implementar broadcast de mensagens WebSocket
- Adicionar persistência com banco de dados
- Implementar testes automatizados
- Adicionar Docker e Docker Compose
- Deploy em cloud (Azure, AWS, Heroku)

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

## 👤 Autor

Projeto de demonstração - WebSocket API Gateway

---

**Desenvolvido com ❤️ usando Node.js e Express**