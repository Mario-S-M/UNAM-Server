#!/bin/sh
set -e

DOMAIN="eskani.enesmorelia.unam.mx"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

echo "[certbot] Iniciando..."
sleep 15

if [ ! -f "$CERT_PATH" ]; then
    echo "[certbot] Certificado no encontrado — solicitando a Let's Encrypt..."
    certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$CERTBOT_EMAIL" \
        --agree-tos \
        --no-eff-email \
        -d "$DOMAIN"
    echo "[certbot] Certificado obtenido exitosamente."
else
    echo "[certbot] Certificado ya existe, saltando emisión."
fi

echo "[certbot] Iniciando loop de renovación automática..."
trap "exit 0" TERM
while :; do
    certbot renew --quiet
    sleep 12h &
    wait $!
done
