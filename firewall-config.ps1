# Liberar porta 3000 no Firewall do Windows
New-NetFirewallRule -DisplayName "Node.js Chat Server (3000)" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
Write-Host "Porta 3000 liberada no Firewall!" -ForegroundColor Green
