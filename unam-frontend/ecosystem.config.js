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
    pm2_log_path: '/home/node/.pm2/logs',
    max_memory_restart: '1G',
    restart_delay: 8000,
    max_restarts: 30,
    min_uptime: '30s',
    kill_timeout: 15000,
    wait_ready: true,
    listen_timeout: 15000
  }]
};