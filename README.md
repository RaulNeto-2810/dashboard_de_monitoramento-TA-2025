# Dashboard de Monitoramento em Tempo Real

Dashboard web para monitoramento de servidores com métricas em tempo real, sistema de alertas e logs dinâmicos. Suporta múltiplos usuários conectados simultaneamente visualizando os mesmos dados.

## 📋 Descrição do Projeto

Sistema completo de monitoramento que simula a coleta e visualização de métricas de desempenho de servidores, incluindo:

- **Métricas em Tempo Real**: CPU, Memória RAM, Requisições/segundo e Tempo de Resposta
- **Gráficos Dinâmicos**: Visualização interativa usando Chart.js
- **Sistema de Alertas**: Notificações quando métricas ultrapassam limites definidos
- **Streaming de Logs**: Logs do sistema atualizados em tempo real
- **Múltiplos Usuários**: Todos visualizam os mesmos dados simultaneamente

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js**: Ambiente de execução JavaScript
- **Express.js**: Framework web para Node.js
- **Socket.io**: Comunicação bidirecional em tempo real

### Frontend

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização responsiva e moderna
- **JavaScript (ES6+)**: Lógica do cliente
- **Chart.js**: Biblioteca de gráficos interativos
- **Socket.io Client**: Cliente para comunicação em tempo real
- **Ionicons**: Ícones modernos

## 📁 Estrutura do Projeto

```
Dashboard de Monitoramento/
├── src/
│   ├── modules/
│   │   ├── metricsGenerator.js    # Geração de métricas do sistema
│   │   ├── logsGenerator.js        # Geração de logs simulados
│   │   └── alertSystem.js          # Sistema de alertas e thresholds
│   └── server.js                   # Servidor Express e Socket.io
├── public/
│   ├── css/
│   │   └── style.css               # Estilos da aplicação
│   ├── js/
│   │   └── script.js               # Lógica do cliente
│   └── index.html                  # Interface do dashboard
├── package.json                    # Dependências e scripts
├── .gitignore                      # Arquivos ignorados pelo Git
└── README.md                       # Documentação
```

## 🔧 Instalação e Execução

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone ou baixe o projeto**

   ```bash
   cd "Dashboard de Monitoramento"
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Inicie o servidor**

   ```bash
   npm start
   ```

   Ou para desenvolvimento com auto-reload:

   ```bash
   npm run dev
   ```

4. **Acesse o dashboard**

   Abra seu navegador e acesse: [http://localhost:3000](http://localhost:3000)

## 📊 Funcionalidades Implementadas

### 1. Geração de Métricas (Backend)

- ✅ Simulação contínua de métricas do sistema
- ✅ Valores gerados de forma realista com variação suave
- ✅ Métricas monitoradas:
  - Utilização de CPU (%)
  - Utilização de Memória RAM (%)
  - Requisições por segundo
  - Tempo de resposta médio (ms)
- ✅ Atualização automática a cada 2 segundos
- ✅ Histórico de métricas mantido (últimos 30 pontos)

### 2. Visualização em Tempo Real (Frontend)

- ✅ Gráficos dinâmicos com Chart.js
- ✅ Atualização automática sem reload da página
- ✅ Cards com valores atuais destacados
- ✅ Interface responsiva e organizada
- ✅ Dois gráficos principais:
  - CPU e Memória
  - Requisições e Tempo de Resposta

### 3. Sistema de Alertas

- ✅ Thresholds configurados para cada métrica:
  - **CPU**: Warning 70%, Critical 90%
  - **Memória**: Warning 75%, Critical 90%
  - **Requisições/s**: Warning 400, Critical 450
  - **Tempo de Resposta**: Warning 300ms, Critical 450ms
- ✅ Alertas visuais nos cards de métricas
- ✅ Notificações toast quando alertas são disparados
- ✅ Histórico de alertas recentes
- ✅ Diferenciação visual entre níveis (warning/critical)

### 4. Streaming de Logs

- ✅ Geração contínua de logs simulados
- ✅ Tipos de logs: info, warning, error
- ✅ Logs de requisições HTTP com detalhes
- ✅ Atualização em tempo real (1 log/segundo)
- ✅ Diferenciação visual por tipo
- ✅ Limite de 100 logs exibidos
- ✅ Botão para limpar logs

### 5. Suporte a Múltiplos Usuários

- ✅ Conexões simultâneas ilimitadas
- ✅ Todos visualizam os mesmos dados em tempo real
- ✅ Contador de usuários conectados
- ✅ Tratamento de conexão e desconexão

## 🎨 Interface do Usuário

### Header

- Logo e título do dashboard
- Indicador de status de conexão
- Contador de usuários online

### Cards de Métricas

- 4 cards principais com valores em tempo real
- Indicadores visuais de status (Normal/Alerta/Crítico)
- Ícones representativos para cada métrica

### Gráficos

- Gráfico de linha para CPU e Memória
- Gráfico de linha dual-axis para Requisições e Tempo de Resposta
- Atualização suave e animada

### Alertas e Logs

- Painel de alertas com badge de contador
- Painel de logs com scroll automático
- Notificações toast para alertas críticos

## 🔌 Eventos Socket.io

### Servidor → Cliente

- `user-count`: Atualização do número de usuários conectados
- `initial-metrics`: Métricas iniciais ao conectar
- `metrics-update`: Atualização de métricas (a cada 2s)
- `metrics-history`: Histórico para gráficos (a cada 5s)
- `initial-alerts`: Alertas recentes ao conectar
- `new-alert`: Novo alerta emitido
- `new-log`: Novo log gerado

### Cliente → Servidor

- Eventos de conexão/desconexão tratados automaticamente

## ⚙️ Configurações

### Modificar Intervalos de Atualização

No arquivo `server.js`:

```javascript
// Métricas (padrão: 2000ms)
setInterval(() => { ... }, 2000);

// Logs (padrão: 1000ms)
setInterval(() => { ... }, 1000);

// Histórico (padrão: 5000ms)
setInterval(() => { ... }, 5000);
```

### Modificar Thresholds de Alertas

No arquivo `modules/alertSystem.js`:

```javascript
this.thresholds = {
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 75, critical: 90 },
  // ... outros thresholds
};
```

### Modificar Porta do Servidor

No arquivo `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

## 🛠️ Módulos Backend

### `metricsGenerator.js`

- Gera valores realistas de métricas
- Mantém histórico para gráficos
- Variação suave entre atualizações

### `logsGenerator.js`

- Simula logs de sistema e HTTP
- Pesos para distribuição realista (70% info, 20% warning, 10% error)
- Mensagens variadas e contextuais

### `alertSystem.js`

- Verifica métricas contra thresholds
- Evita alertas duplicados
- Mantém histórico de alertas

## 📱 Responsividade

O dashboard é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com múltiplas colunas
- **Tablet**: Ajuste de grid para melhor visualização
- **Mobile**: Layout em coluna única, otimizado para toque

## 🔒 Segurança

Considerações de segurança implementadas:

- Tratamento de erros em conexões Socket.io
- Validação de eventos
- Limitação de histórico de logs e alertas
- Graceful shutdown do servidor

## 📈 Performance

Otimizações implementadas:

- Atualização de gráficos sem animação completa (`update('none')`)
- Limitação de logs e alertas mantidos em memória
- Histórico limitado de métricas (30 pontos)
- Remoção automática de toasts após 5 segundos

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Desenvolvimento

Desenvolvido como projeto de demonstração de dashboard em tempo real com Node.js, Express e Socket.io.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório do projeto.

---

**Nota**: Este é um projeto de demonstração. As métricas são simuladas e não refletem dados reais de sistema.
