FROM nginx:1.25-alpine

# SSL config baked in — init-ssl.sh activates it once certs are ready
COPY default.conf /etc/nginx/conf.d/default.conf.ssl
COPY init-ssl.sh /init-ssl.sh
RUN chmod +x /init-ssl.sh

ENTRYPOINT ["/init-ssl.sh"]
