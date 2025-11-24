class LogsGenerator {
    constructor() {
        this.logTypes = ['info', 'warning', 'error'];
        this.endpoints = ['/api/users', '/api/products', '/api/orders', '/api/dashboard', '/api/auth'];
        this.statusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 503];
        this.methods = ['GET', 'POST', 'PUT', 'DELETE'];
        this.messages = {
            info: [
                'Requisição processada com sucesso',
                'Conexão com banco de dados estabelecida',
                'Cache atualizado',
                'Sessão de usuário criada',
                'Arquivo enviado com sucesso',
                'Job processado na fila',
                'Email enviado com sucesso'
            ],
            warning: [
                'Taxa de requisições acima do normal',
                'Memória cache quase cheia',
                'Tempo de resposta elevado',
                'Tentativa de login falhou',
                'Token próximo da expiração',
                'Pool de conexões em 80%'
            ],
            error: [
                'Erro ao conectar com banco de dados',
                'Timeout na requisição externa',
                'Falha na autenticação',
                'Erro interno do servidor',
                'Recurso não encontrado',
                'Permissão negada',
                'Falha ao processar pagamento'
            ]
        };
    }

    generateLog() {
        const type = this.getWeightedLogType();
        const timestamp = new Date().toISOString();

        // Logs de requisição HTTP
        if (Math.random() > 0.3) {
            const method = this.getRandomItem(this.methods);
            const endpoint = this.getRandomItem(this.endpoints);
            const statusCode = this.getStatusCodeForType(type);
            const responseTime = this.getResponseTimeForType(type);

            return {
                type,
                timestamp,
                message: `${method} ${endpoint} ${statusCode} - ${responseTime}ms`,
                details: {
                    method,
                    endpoint,
                    statusCode,
                    responseTime
                }
            };
        }

        // Logs de sistema
        return {
            type,
            timestamp,
            message: this.getRandomItem(this.messages[type]),
            details: {}
        };
    }

    getWeightedLogType() {
        const random = Math.random();

        // 70% info, 20% warning, 10% error
        if (random < 0.7) return 'info';
        if (random < 0.9) return 'warning';
        return 'error';
    }

    getStatusCodeForType(type) {
        if (type === 'info') {
            return this.getRandomItem([200, 201, 204]);
        } else if (type === 'warning') {
            return this.getRandomItem([400, 401, 403, 404]);
        } else {
            return this.getRandomItem([500, 503]);
        }
    }

    getResponseTimeForType(type) {
        if (type === 'info') {
            return Math.floor(Math.random() * 200) + 50; // 50-250ms
        } else if (type === 'warning') {
            return Math.floor(Math.random() * 500) + 250; // 250-750ms
        } else {
            return Math.floor(Math.random() * 1000) + 500; // 500-1500ms
        }
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = LogsGenerator;
