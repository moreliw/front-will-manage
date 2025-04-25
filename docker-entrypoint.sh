#!/bin/sh

# Update nginx configuration with environment variables
sed -i -e "s/\$PORT/$PORT/g" /etc/nginx/conf.d/default.conf

# Create custom nginx.conf with reduced worker processes to prevent io_setup errors
cat > /etc/nginx/nginx.conf << 'EOF'
user nginx;
worker_processes 2;
worker_rlimit_nofile 1024;
pid /var/run/nginx.pid;

events {
    worker_connections 512;
    multi_accept off;
    use epoll;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # Disable AIO to prevent io_setup() errors
    aio off;
    
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Start nginx
nginx -g "daemon off;"