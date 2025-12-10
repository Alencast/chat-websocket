# 🐰 Integração RabbitMQ - Arquitetura Produtor/Consumidor

## 📋 Arquivos Criados

### 1. `services/rabbitmq.js` (Serviço de Integração)
- Gerencia conexão com RabbitMQ
- Cria canal e declara fila `chat.mensagens`
- Função `publishMessage()` para enviar mensagens (produtor)

### 2. `consumer.js` (Processo Consumidor)
- Processo Node.js separado
- Consome mensagens da fila `chat.mensagens`
- Imprime mensagens no console
- Salva em arquivo `mensagens-consumidas.log`

### 3. Modificações em `gateway.js`
- Importa serviço RabbitMQ
- Inicializa conexão no startup
- Publica mensagens do chat na fila (linha 281-287)

---

## 🚀 Como Usar

### Passo 1: Iniciar RabbitMQ
```bash
# Usando Docker (recomendado)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Ou instalar localmente:
# Windows: choco install rabbitmq
# Linux: sudo apt install rabbitmq-server
# Mac: brew install rabbitmq
```

**Painel Admin:** http://localhost:15672 (guest/guest)

### Passo 2: Iniciar o Servidor do Chat (Produtor)
```bash
npm start
```

### Passo 3: Iniciar o Consumidor (Terminal Separado)
```bash
npm run consumer
```

### Passo 4: Testar
1. Abra http://localhost:3000
2. Entre no chat e envie mensagens
3. Veja as mensagens sendo processadas no terminal do consumidor
4. Verifique o arquivo `mensagens-consumidas.log`

---

## 🏗️ Arquitetura

```
┌──────────────┐
│   Cliente    │
│  (Browser)   │
└──────┬───────┘
       │ WebSocket
       ↓
┌──────────────────────────┐
│   Gateway (gateway.js)   │  ← PRODUTOR
│  - Recebe mensagens      │
│  - Publica no RabbitMQ   │
└──────┬───────────────────┘
       │
       │ AMQP
       ↓
┌──────────────────────────┐
│       RabbitMQ           │
│   Fila: chat.mensagens   │
└──────┬───────────────────┘
       │
       │ AMQP
       ↓
┌──────────────────────────┐
│  Consumidor (consumer.js)│  ← CONSUMIDOR
│  - Consome mensagens     │
│  - Imprime no console    │
│  - Salva em arquivo      │
└──────────────────────────┘
```

---

## ✅ Requisitos Atendidos

- ✅ **Produtor**: Gateway envia mensagens para fila
- ✅ **Consumidor**: Processo separado consome da fila
- ✅ **MOM**: RabbitMQ gerenciando fila
- ✅ **Fila**: `chat.mensagens` declarada e ativa
- ✅ **Interligação**: Processos independentes comunicando via RabbitMQ

---

## 📊 Logs Esperados

### Terminal do Gateway:
```
[RabbitMQ] Conectado com sucesso
[RabbitMQ] Fila 'chat.mensagens' pronta
[Chat] João: Olá pessoal!
[RabbitMQ] Mensagem publicada: João - Olá pessoal!
```

### Terminal do Consumidor:
```
[Consumidor] Aguardando mensagens na fila 'chat.mensagens'...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Consumidor] Nova mensagem recebida:
  Usuário: João (ID: 1)
  Mensagem: Olá pessoal!
  Timestamp: 2025-12-09T14:30:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🛠️ Troubleshooting

**Erro: "ECONNREFUSED 127.0.0.1:5672"**
→ RabbitMQ não está rodando. Inicie com Docker ou instale localmente.

**Mensagens não aparecem no consumidor**
→ Verifique se o consumidor está rodando (`npm run consumer`)

**Fila não cria**
→ Verifique permissões do RabbitMQ no painel admin

---

## 🎯 Funcionamento

1. **Chat funciona normalmente** (WebSocket broadcast continua)
2. **Gateway TAMBÉM publica** cada mensagem no RabbitMQ
3. **Consumidor processa** as mensagens de forma assíncrona
4. **Sistemas desacoplados**: Chat não depende do consumidor

**Vantagens:**
- Auditoria de mensagens
- Processamento assíncrono
- Escalabilidade (múltiplos consumidores)
- Persistência de mensagens
