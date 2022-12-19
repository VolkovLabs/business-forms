# server-mysql

## USERNAME and EMAIL

In this example, the `USERNAME` and `EMAIL` are determined automatically in Grafana.

## HTTP Proxy

Here is the article where we explained how to use NGINX and HTTP Proxy as alternatives:

<https://volkovlabs.com/how-to-connect-the-data-manipulation-plugin-for-grafana-to-api-server-1abe5f60c904>

In this example, we implemented the second option - `NGINX reverse proxy`.

Here is an example of `NGINX` config file:

```nginx
server {
  listen 443 ssl;

  include /etc/nginx/conf.d/http_headers.conf;

  ssl_certificate /etc/nginx/ssl.crt;
  ssl_certificate_key /etc/nginx/ssl.key;

  ssl_session_cache builtin:1000 shared:SSL:10m;
  ssl_protocols TLSv1.2;
  ssl_ciphers EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH;
  ssl_prefer_server_ciphers on;

  # grafana instance
  location / {
    proxy_pass http://${GRAFANA_HOST}:${GRAFANA_PORT};
    include /etc/nginx/conf.d/proxy.conf;
  }

  # for api get method
  location /api/grafana-api-server-mysql/q1-get {
   proxy_pass http://${API_HOST}:${API_PORT};
   include /etc/nginx/conf.d/proxy.conf;
  }
  # for api post method
  location /api/grafana-api-server-mysql/q1-post {
   proxy_pass http://${API_HOST}:${API_PORT};
   include /etc/nginx/conf.d/proxy.conf;
  }
}
```

This option is CORS-ready as an endpoint is a part of the same domain.

Check the protocol used to connect to Grafana and API. It should be the same, recommended HTTPS. Related issue: <https://github.com/VolkovLabs/volkovlabs-form-panel/issues/124>

## GET settings in Grafana plugin

In the plugin `Initial Request` settings set this value: `/api/grafana-api-server-mysql/q1-get?${__user.login}`

## POST settings in Grafana plugin

In the plugin `Update Request` settings set this value: `/api/grafana-api-server-mysql/q1-post`
