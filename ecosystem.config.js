module.exports = {
  apps: [
    {
      name: 'amnezia-vpn-tg-bot',
      script: 'src/index.js',
      env: {
        NODE_ENV: 'production'
        // Остальные переменные окружения берутся из .env
      },
      watch: false,
      max_restarts: 10,
      restart_delay: 5000
    }
  ]
};

