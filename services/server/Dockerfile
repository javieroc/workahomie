FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=development /usr/src/app/dist ./dist

USER node

EXPOSE 8000/tcp

CMD [ "node", "dist/main.js" ]
