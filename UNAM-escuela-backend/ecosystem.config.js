module.exports = {
  apps: [{
    name: 'unam-backend',
    script: 'dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    out_file: '/app/logs/backend/out.log',
    error_file: '/app/logs/backend/error.log',
    log_file: '/app/logs/backend/combined.log',
    merge_logs: true,
    pm2_log_path: '/root/.pm2/logs',
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 8000
  }]
};