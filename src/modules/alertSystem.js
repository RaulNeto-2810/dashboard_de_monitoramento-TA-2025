class AlertSystem {
    constructor() {
        this.thresholds = {
            cpu: { warning: 70, critical: 90 },
            memory: { warning: 75, critical: 90 },
            requestsPerSecond: { warning: 400, critical: 450 },
            avgResponseTime: { warning: 300, critical: 450 }
        };

        this.recentAlerts = [];
        this.maxAlertsHistory = 50;

        // Estado anterior para evitar alertas repetidos
        this.previousAlertState = {};
    }

    checkMetrics(metrics) {
        const alerts = [];
        const currentAlertState = {};

        // Verificar CPU
        const cpuAlert = this.checkThreshold('CPU', metrics.cpu, this.thresholds.cpu);
        if (cpuAlert) {
            currentAlertState.cpu = cpuAlert.severity;
            if (this.previousAlertState.cpu !== cpuAlert.severity) {
                alerts.push(cpuAlert);
                this.addToHistory(cpuAlert);
            }
        } else {
            currentAlertState.cpu = null;
        }

        // Verificar Memória
        const memoryAlert = this.checkThreshold('Memória', metrics.memory, this.thresholds.memory);
        if (memoryAlert) {
            currentAlertState.memory = memoryAlert.severity;
            if (this.previousAlertState.memory !== memoryAlert.severity) {
                alerts.push(memoryAlert);
                this.addToHistory(memoryAlert);
            }
        } else {
            currentAlertState.memory = null;
        }

        // Verificar Requisições
        const reqAlert = this.checkThreshold(
            'Requisições/s',
            metrics.requestsPerSecond,
            this.thresholds.requestsPerSecond
        );
        if (reqAlert) {
            currentAlertState.requests = reqAlert.severity;
            if (this.previousAlertState.requests !== reqAlert.severity) {
                alerts.push(reqAlert);
                this.addToHistory(reqAlert);
            }
        } else {
            currentAlertState.requests = null;
        }

        // Verificar Tempo de Resposta
        const responseAlert = this.checkThreshold(
            'Tempo de Resposta',
            metrics.avgResponseTime,
            this.thresholds.avgResponseTime
        );
        if (responseAlert) {
            currentAlertState.response = responseAlert.severity;
            if (this.previousAlertState.response !== responseAlert.severity) {
                alerts.push(responseAlert);
                this.addToHistory(responseAlert);
            }
        } else {
            currentAlertState.response = null;
        }

        this.previousAlertState = currentAlertState;

        return alerts;
    }

    checkThreshold(metricName, value, threshold) {
        if (value >= threshold.critical) {
            return {
                id: Date.now() + Math.random(),
                metric: metricName,
                value: value,
                severity: 'critical',
                message: `${metricName} em nível CRÍTICO: ${value.toFixed(2)}`,
                timestamp: new Date().toISOString()
            };
        } else if (value >= threshold.warning) {
            return {
                id: Date.now() + Math.random(),
                metric: metricName,
                value: value,
                severity: 'warning',
                message: `${metricName} em nível de ALERTA: ${value.toFixed(2)}`,
                timestamp: new Date().toISOString()
            };
        }

        return null;
    }

    addToHistory(alert) {
        this.recentAlerts.unshift(alert);

        // Manter apenas os últimos N alertas
        if (this.recentAlerts.length > this.maxAlertsHistory) {
            this.recentAlerts.pop();
        }
    }

    getRecentAlerts() {
        return this.recentAlerts;
    }
}

module.exports = AlertSystem;
