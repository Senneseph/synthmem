# Nginx configuration for synthmem.iffuso.com
# This file should be placed at /etc/nginx/sites-available/synthmem.iffuso.com

# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name synthmem.iffuso.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl;
    server_name synthmem.iffuso.com;

    ssl_certificate /etc/letsencrypt/live/synthmem.iffuso.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/synthmem.iffuso.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    # Security headers
    add_header Strict-Transport-Security 'max-age=31536000; includeSubDomains' always;
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript application/manifest+json;

    client_max_body_size 10M;

    # PWA manifest - needs proper MIME type
    location = /manifest.webmanifest {
        proxy_pass http://localhost:4208/manifest.webmanifest;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Content-Type application/manifest+json;
    }

    # Service worker - no caching
    location = /sw.js {
        proxy_pass http://localhost:4208/sw.js;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    # Static assets - cache for 1 year
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot|webp)$ {
        proxy_pass http://localhost:4208;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend - SPA routing
    location / {
        proxy_pass http://localhost:4208;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:4208/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}

