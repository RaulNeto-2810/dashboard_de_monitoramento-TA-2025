const socket = io();

const elements = {
    userCount: document.getElementById('userCount'),
    cpuValue: document.getElementById('cpuValue'),
    memoryValue: document.getElementById('memoryValue'),
    requestsValue: document.getElementById('requestsValue'),
    responseValue: document.getElementById('responseValue'),
    cpuStatus: document.getElementById('cpuStatus'),
    memoryStatus: document.getElementById('memoryStatus'),
    requestsStatus: document.getElementById('requestsStatus'),
    responseStatus: document.getElementById('responseStatus'),
    cpuCard: document.getElementById('cpu-card'),
    memoryCard: document.getElementById('memory-card'),
    requestsCard: document.getElementById('requests-card'),
    responseCard: document.getElementById('response-card'),
    alertsList: document.getElementById('alertsList'),
    alertCount: document.getElementById('alertCount'),
    logsList: document.getElementById('logsList'),
    clearLogs: document.getElementById('clearLogs'),
    toastContainer: document.getElementById('toastContainer')
};

// Configuração dos Gráficos
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        animation: {
            duration: 750
        }
    }
};

// Gráfico de Sistema (CPU e Memória)
const systemChart = new Chart(document.getElementById('systemChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'CPU (%)',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Memória (%)',
                data: [],
                borderColor: '#9b59b6',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    options: {
        ...chartConfig.options,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Gráfico de Performance (Requisições e Tempo de Resposta)
const performanceChart = new Chart(document.getElementById('performanceChart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Requisições/s',
                data: [],
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            },
            {
                label: 'Tempo de Resposta (ms)',
                data: [],
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        ...chartConfig.options,
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Requisições/s'
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Tempo de Resposta (ms)'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }
});

// Variáveis de controle
let alertsCount = 0;
const maxLogs = 100;

socket.on('connect', () => {
    console.log('Conectado ao servidor');
});

socket.on('disconnect', () => {
    console.log('Desconectado do servidor');
});

socket.on('user-count', (count) => {
    elements.userCount.textContent = count;
});

socket.on('initial-metrics', (metrics) => {
    updateMetrics(metrics);
});

socket.on('metrics-update', (metrics) => {
    updateMetrics(metrics);
});

socket.on('metrics-history', (history) => {
    updateCharts(history);
});

socket.on('initial-alerts', (alerts) => {
    alerts.forEach(alert => addAlert(alert, false));
});

socket.on('new-alert', (alert) => {
    addAlert(alert, true);
    showToast(alert);
});

socket.on('new-log', (log) => {
    addLog(log);
});

// Funções de Atualização
function updateMetrics(metrics) {
    // Atualizar valores
    elements.cpuValue.textContent = metrics.cpu.toFixed(1);
    elements.memoryValue.textContent = metrics.memory.toFixed(1);
    elements.requestsValue.textContent = Math.round(metrics.requestsPerSecond);
    elements.responseValue.textContent = Math.round(metrics.avgResponseTime);

    // Atualizar status e estilos
    updateMetricStatus('cpu', metrics.cpu, 70, 90);
    updateMetricStatus('memory', metrics.memory, 75, 90);
    updateMetricStatus('requests', metrics.requestsPerSecond, 400, 450);
    updateMetricStatus('response', metrics.avgResponseTime, 300, 450);
}

function updateMetricStatus(metric, value, warningThreshold, criticalThreshold) {
    const statusElement = elements[`${metric}Status`];
    const cardElement = elements[`${metric}Card`];

    // Remover classes antigas
    statusElement.classList.remove('warning', 'critical');
    cardElement.classList.remove('warning', 'critical');

    if (value >= criticalThreshold) {
        statusElement.textContent = 'Crítico';
        statusElement.classList.add('critical');
        cardElement.classList.add('critical');
    } else if (value >= warningThreshold) {
        statusElement.textContent = 'Alerta';
        statusElement.classList.add('warning');
        cardElement.classList.add('warning');
    } else {
        statusElement.textContent = 'Normal';
    }
}

function updateCharts(history) {
    // Atualizar gráfico de sistema
    systemChart.data.labels = history.timestamps;
    systemChart.data.datasets[0].data = history.cpu;
    systemChart.data.datasets[1].data = history.memory;
    systemChart.update('none');

    // Atualizar gráfico de performance
    performanceChart.data.labels = history.timestamps;
    performanceChart.data.datasets[0].data = history.requestsPerSecond;
    performanceChart.data.datasets[1].data = history.avgResponseTime;
    performanceChart.update('none');
}

function addAlert(alert, showAnimation = true) {
    // Remover mensagem de "sem alertas"
    const noData = elements.alertsList.querySelector('.no-data');
    if (noData) {
        noData.remove();
    }

    // Criar elemento de alerta
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.severity}`;
    alertElement.innerHTML = `
        <div class="alert-message">${alert.message}</div>
        <div class="alert-time">${formatTime(alert.timestamp)}</div>
    `;

    // Adicionar no início da lista
    elements.alertsList.insertBefore(alertElement, elements.alertsList.firstChild);

    // Incrementar contador
    alertsCount++;
    elements.alertCount.textContent = alertsCount;

    // Limitar número de alertas exibidos
    const alerts = elements.alertsList.querySelectorAll('.alert-item');
    if (alerts.length > 50) {
        alerts[alerts.length - 1].remove();
    }
}

function addLog(log) {
    // Remover mensagem de "aguardando logs"
    const noData = elements.logsList.querySelector('.no-data');
    if (noData) {
        noData.remove();
    }

    // Criar elemento de log
    const logElement = document.createElement('div');
    logElement.className = `log-item ${log.type}`;
    logElement.innerHTML = `
        <span class="log-time">[${formatTime(log.timestamp)}]</span>
        <span class="log-message">${log.message}</span>
    `;

    // Adicionar no início da lista
    elements.logsList.insertBefore(logElement, elements.logsList.firstChild);

    // Limitar número de logs
    const logs = elements.logsList.querySelectorAll('.log-item');
    if (logs.length > maxLogs) {
        logs[logs.length - 1].remove();
    }
}

function showToast(alert) {
    const toast = document.createElement('div');
    toast.className = `toast ${alert.severity}`;
    toast.innerHTML = `
        <ion-icon name="alert-circle-outline"></ion-icon>
        <div class="toast-content">
            <div class="toast-message">${alert.message}</div>
            <div class="toast-time">${formatTime(alert.timestamp)}</div>
        </div>
    `;

    elements.toastContainer.appendChild(toast);

    // Remover toast após 5 segundos
    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
}

// Limpar logs
elements.clearLogs.addEventListener('click', () => {
    elements.logsList.innerHTML = `
        <div class="no-data">
            <ion-icon name="reader-outline"></ion-icon>
            <p>Aguardando logs...</p>
        </div>
    `;
});

// Tratamento de erros
socket.on('connect_error', (error) => {
    console.error('Erro de conexão:', error);
});

socket.on('error', (error) => {
    console.error('Erro no socket:', error);
});

console.log('Dashboard de Monitoramento inicializado');
