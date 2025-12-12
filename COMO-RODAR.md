# Como Rodar o Sistema

## Pré-requisitos
- Node.js instalado
- Docker Desktop rodando

---

## Passo 1: Instalar Dependências

```bash
npm install
```

---

## Passo 2: Iniciar RabbitMQ

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

Verificar se está rodando:
```bash
docker ps
```

Interface web: http://localhost:15672 (usuário: `guest`, senha: `guest`)

---

## Passo 3: Liberar Firewall (Windows)

Abrir PowerShell como **Administrador** e executar:

```powershell
New-NetFirewallRule -DisplayName "Node.js Chat Server (3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## Passo 4: Iniciar Gateway (Terminal 1)

```bash
npm start
```

Anotar o IP exibido. Exemplo:
```
🌐 Acesso na Rede:
   http://10.24.12.170:3000
```

---

## Passo 5: Iniciar Consumer (Terminal 2)

```bash
npm run consumer
```

Deve aparecer:
```
[Consumidor] Aguardando mensagens na fila 'chat.mensagens'...
```

---

## Testar

### No mesmo computador:
http://localhost:3000

### Em outros dispositivos (mesma rede Wi-Fi):
http://10.24.12.170:3000  
*(use o IP que apareceu no Terminal 1)*

---

## Parar Tudo

**Gateway:** CTRL+C no Terminal 1  
**Consumer:** CTRL+C no Terminal 2  
**RabbitMQ:** `docker stop rabbitmq`

---

## Troubleshooting

### Erro: ECONNREFUSED
- RabbitMQ não está rodando → `docker start rabbitmq`

### Outros PCs não acessam
- Firewall bloqueando → Execute o comando do Passo 3
- IP errado → Use o IP do Wi-Fi (não 172.x.x.x)

### Porta 3000 em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
