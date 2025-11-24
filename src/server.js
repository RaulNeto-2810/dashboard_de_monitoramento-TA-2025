const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const MetricsGenerator = require('./modules/metricsGenerator');
const LogsGenerator = require('./modules/logsGenerator');
const AlertSystem = require('./modules/alertSystem');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Inicializar geradores e sistemas
const metricsGenerator = new MetricsGenerator();
const logsGenerator = new LogsGenerator();
const alertSystem = new AlertSystem();

let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    console.log(`Novo usuário conectado. Total de usuários: ${connectedUsers}`);

    // Notificar todos sobre o número de usuários
    io.emit('user-count', connectedUsers);

    // Enviar dados iniciais para o novo usuário
    socket.emit('initial-metrics', metricsGenerator.getCurrentMetrics());
    socket.emit('initial-alerts', alertSystem.getRecentAlerts());

    // Desconexão
    socket.on('disconnect', () => {
        connectedUsers--;
        console.log(`Usuário desconectado. Total de usuários: ${connectedUsers}`);
        io.emit('user-count', connectedUsers);
    });

    // Tratamento de erros
    socket.on('error', (error) => {
        console.error('Erro no socket:', error);
    });
});

// Geração e envio de métricas a cada 2 segundos
setInterval(() => {
    const metrics = metricsGenerator.generateMetrics();
    io.emit('metrics-update', metrics);

    // Verificar alertas
    const alerts = alertSystem.checkMetrics(metrics);
    if (alerts.length > 0) {
        alerts.forEach(alert => {
            io.emit('new-alert', alert);
        });
    }
}, 2000);

// Geração e envio de logs a cada 1 segundo
setInterval(() => {
    const log = logsGenerator.generateLog();
    io.emit('new-log', log);
}, 1000);

// Envio do histórico de métricas a cada 5 segundos
setInterval(() => {
    const history = metricsGenerator.getHistory();
    io.emit('metrics-history', history);
}, 5000);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

// Tratamento de erros do servidor
server.on('error', (error) => {
    console.error('Erro no servidor:', error);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM recebido, encerrando servidor...');
    server.close(() => {
        console.log('Servidor encerrado');
        process.exit(0);
    });
});
