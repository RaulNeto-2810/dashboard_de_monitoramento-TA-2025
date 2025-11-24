class MetricsGenerator {
    constructor() {
        this.currentMetrics = {
            cpu: 20,
            memory: 30,
            requestsPerSecond: 100,
            avgResponseTime: 150
        };

        this.history = {
            cpu: [],
            memory: [],
            requestsPerSecond: [],
            avgResponseTime: [],
            timestamps: []
        };

        this.maxHistoryLength = 30; // Manter últimos 30 pontos
    }

    generateMetrics() {
        // Gerar valores realistas com variação suave
        this.currentMetrics.cpu = this.generateRealisticValue(
            this.currentMetrics.cpu, 0, 100, 5
        );

        this.currentMetrics.memory = this.generateRealisticValue(
            this.currentMetrics.memory, 0, 100, 3
        );

        this.currentMetrics.requestsPerSecond = Math.max(0, this.generateRealisticValue(
            this.currentMetrics.requestsPerSecond, 50, 500, 20
        ));

        this.currentMetrics.avgResponseTime = Math.max(10, this.generateRealisticValue(
            this.currentMetrics.avgResponseTime, 50, 500, 30
        ));

        // Adicionar ao histórico
        this.addToHistory();

        return {
            ...this.currentMetrics,
            timestamp: new Date().toISOString()
        };
    }

    generateRealisticValue(currentValue, min, max, maxChange) {
        // Adicionar variação aleatória suave
        const change = (Math.random() - 0.5) * 2 * maxChange;
        let newValue = currentValue + change;

        // Manter dentro dos limites
        newValue = Math.max(min, Math.min(max, newValue));

        // Arredondar para 2 casas decimais
        return Math.round(newValue * 100) / 100;
    }

    addToHistory() {
        const timestamp = new Date().toLocaleTimeString('pt-BR');

        this.history.cpu.push(this.currentMetrics.cpu);
        this.history.memory.push(this.currentMetrics.memory);
        this.history.requestsPerSecond.push(this.currentMetrics.requestsPerSecond);
        this.history.avgResponseTime.push(this.currentMetrics.avgResponseTime);
        this.history.timestamps.push(timestamp);

        // Manter apenas os últimos N pontos
        if (this.history.cpu.length > this.maxHistoryLength) {
            this.history.cpu.shift();
            this.history.memory.shift();
            this.history.requestsPerSecond.shift();
            this.history.avgResponseTime.shift();
            this.history.timestamps.shift();
        }
    }

    getCurrentMetrics() {
        return {
            ...this.currentMetrics,
            timestamp: new Date().toISOString()
        };
    }

    getHistory() {
        return this.history;
    }
}

module.exports = MetricsGenerator;
