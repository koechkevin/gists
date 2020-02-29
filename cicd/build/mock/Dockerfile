# Docker file for building and running mock service in dev environment.

FROM node:10-alpine

WORKDIR /app

COPY .npmrc ./
COPY package.json ./
COPY mock ./mock/
COPY cicd/build/mock/json-server.json ./

RUN npm config set unsafe-perm true && \
    npm install -g json-server && \
    npm install --quiet

EXPOSE 80

CMD [ "npm", "run", "mock" ]
