FROM node

## Create app directory
WORKDIR /app

## Copy Server
COPY server.ts .

## Add packages
RUN npm install -g ts-node

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

EXPOSE 3001

CMD /wait && ts-node server.ts
