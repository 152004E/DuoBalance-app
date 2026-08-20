module.exports = {
  apps: [
    {
      name: 'duobalance-api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      // Reinicia si la API muere
      max_memory_restart: '256M',
      // Logs
      error_file: '/var/log/duobalance-api/error.log',
      out_file: '/var/log/duobalance-api/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 10000,
    },
  ],
};
