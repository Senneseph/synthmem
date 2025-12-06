#!/bin/bash
# Deployment script for SynthMem to DigitalOcean server
# Usage: ./scripts/deploy.sh

set -e

# Configuration
SERVER_IP="${DEPLOY_SERVER_IP:-167.71.191.234}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/a-icon-deploy}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_DIR="/opt/synthmem"
DOMAIN="synthmem.iffuso.com"

echo "=========================================="
echo "  SynthMem Deployment Script"
echo "=========================================="
echo "Server: $SERVER_IP"
echo "Remote directory: $REMOTE_DIR"
echo "Domain: $DOMAIN"
echo ""

# Check SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "ERROR: SSH key not found at $SSH_KEY"
    exit 1
fi

SSH_CMD="ssh -i $SSH_KEY -o StrictHostKeyChecking=no $REMOTE_USER@$SERVER_IP"
SCP_CMD="scp -i $SSH_KEY -o StrictHostKeyChecking=no"

echo "[1/7] Creating remote directory structure..."
$SSH_CMD "mkdir -p $REMOTE_DIR"

echo "[2/7] Syncing project files to server..."
# Sync necessary files (excluding node_modules, .git, etc.)
rsync -avz --progress \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude '.env' \
    --exclude '*.log' \
    --exclude 'coverage' \
    --exclude '.DS_Store' \
    --exclude 'meta' \
    ./ $REMOTE_USER@$SERVER_IP:$REMOTE_DIR/

echo "[3/7] Setting up nginx configuration..."
$SSH_CMD "cp $REMOTE_DIR/deploy/nginx/$DOMAIN /etc/nginx/sites-available/$DOMAIN"
$SSH_CMD "ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/$DOMAIN"

echo "[4/7] Checking for SSL certificate..."
$SSH_CMD "
if [ ! -f /etc/letsencrypt/live/$DOMAIN/fullchain.pem ]; then
    echo 'SSL certificate not found, creating with certbot...'
    certbot certonly --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@iffuso.com || {
        echo 'Certbot failed, attempting standalone mode...'
        systemctl stop nginx
        certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@iffuso.com
        systemctl start nginx
    }
else
    echo 'SSL certificate already exists.'
fi
"

echo "[5/7] Building and starting Docker containers..."
$SSH_CMD "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml build --no-cache"
$SSH_CMD "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml down 2>/dev/null || true"
$SSH_CMD "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml up -d"

echo "[6/7] Testing nginx configuration and reloading..."
$SSH_CMD "nginx -t && systemctl reload nginx"

echo "[7/7] Verifying deployment..."
sleep 5
$SSH_CMD "docker ps | grep synthmem"

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo "Application available at: https://$DOMAIN"
echo ""
echo "To check logs:"
echo "  ssh -i $SSH_KEY $REMOTE_USER@$SERVER_IP 'docker logs synthmem-frontend'"
echo ""

