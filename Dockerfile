FROM node:16.14.2-alpine

WORKDIR /app

COPY package*.json /app/
COPY ./services/server/package*.json ./services/server/

RUN npm install

COPY . .
