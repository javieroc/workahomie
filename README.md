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

docker exec -it [container_id] sh

npm run command seed-data
```

### Web

For the moment run the app manually

```
cp apps/web/.env.template apps/web/.env
npm run dev --workspace=web
```

## TODOs

- [x] Fix: Nav bar "how it works" link
- [ ] Fix: wishlist request on home screen
- [x] Fix: Move my requests to the navbar
- [x] Fix: Change About Us redirect on home screen
- [x] Fix: search input icon, looks odd
- [x] Feat: hosts filters
- [ ] Feat: wire reviews
- [ ] Feat: calculate rate based on reviews
- [ ] Feat: Custom map popup, display host card
- [ ] Feat: multi channel chat
- [ ] Fix: my place form when edit
- [ ] Chore: Review Login flow again
- [ ] Chore: Improve map visibility
