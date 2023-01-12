FROM nginx:stable-alpine

## Environment
ENV API_HOST=localhost
ENV API_PORT=3001
ENV GRAFANA_HOST=localhost
ENV GRAFANA_PORT=3000
ENV GRAFANA_SSL=/C=US/ST=Florida/L=Tampa/O=Volkov Labs/OU=Technology/CN=localhost/

## Generate certificate
RUN apk add --update openssl && \
    rm -rf /var/cache/apk/*
RUN openssl req -x509 -out /etc/nginx/ssl.crt -keyout /etc/nginx/ssl.key -newkey rsa:4096 -nodes -sha256 -subj ${GRAFANA_SSL}
    
## Copy configuration
COPY default.conf /etc/nginx/templates/default.conf.template
COPY proxy.conf /etc/nginx/conf.d/proxy.conf
COPY http_headers.conf /etc/nginx/conf.d/http_headers.conf

CMD ["nginx", "-g", "daemon off;"]