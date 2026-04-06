#!/bin/sh
set -e

DOMAIN="eskani.enesmorelia.unam.mx"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
SSL_CONF="/etc/nginx/conf.d/default.conf.ssl"
ACTIVE_CONF="/etc/nginx/conf.d/default.conf"

if [ ! -f "$CERT_PATH" ]; then
    echo "[nginx] Certificados SSL no encontrados — arrancando en modo HTTP para certbot..."

    # Config temporal solo HTTP para que certbot pueda validar el dominio
    cat > "$ACTIVE_CONF" << 'CONF'
server {
    listen 80;
    server_name eskani.enesmorelia.unam.mx;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 200 'Configurando SSL, espera un momento...';
        add_header Content-Type text/plain;
    }
}
CONF

    # Arrancar nginx en background
    nginx &

    echo "[nginx] Esperando que certbot genere los certificados..."
    until [ -f "$CERT_PATH" ]; do
        sleep 5
        echo "[nginx] Aún esperando certs..."
    done

    echo "[nginx] Certificados encontrados — activando config SSL..."
    cp "$SSL_CONF" "$ACTIVE_CONF"
    nginx -s reload

    echo "[nginx] SSL activo. Nginx corriendo normalmente."
    # Esperar al proceso nginx en background
    wait
else
    echo "[nginx] Certificados SSL encontrados — arrancando directamente con HTTPS."
    cp "$SSL_CONF" "$ACTIVE_CONF"
    exec nginx -g "daemon off;"
fi
