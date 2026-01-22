Place your SSL certificate and key here:

- fullchain.pem: PEM file containing server cert + intermediate chain
- llave.key: PEM private key for the certificate

These files are mounted into the Nginx container at:

- /etc/ssl/certs/enesmorelia.unam.mx.cer
- /etc/ssl/private/llave.key

Notes:

- Ensure files are valid PEM format beginning with "-----BEGIN CERTIFICATE-----" and "-----BEGIN PRIVATE KEY-----".
- For production, use the certificate issued for enesmorelia.unam.mx.
- After placing files, rebuild Nginx: `docker compose up -d --build nginx`.
