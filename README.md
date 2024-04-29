# Workahomies

Application to connect collegues and people that is looking for co-workers.

## Setting up

Install all dependencies

```
npm install
```

Either server and web dependencies will be installed due this is a monorepo.

### Server

```
cp services/server/.env.template services/server/.env
docker compose up -d
```

### Web

For the moment run the app manually

```
cp services/server/.env.template services/server/.env
npm run dev --workspace=web
```
