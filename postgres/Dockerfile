FROM node

## Create app directory
WORKDIR /app

## Copy Server
COPY server.ts .

## Add Postgres package
RUN yarn add pg

EXPOSE 3001
CMD [ "node", "server.ts" ]