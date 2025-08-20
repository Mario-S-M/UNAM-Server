module.exports = {
  apps: [{
    name: 'unam-frontend',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    out_file: '/app/logs/frontend/out.log',
    error_file: '/app/logs/frontend/error.log',
    log_file: '/app/logs/frontend/combined.log',
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