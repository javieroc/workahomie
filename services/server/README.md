# Workahomie API

NestJS 11 + MongoDB (Mongoose 8) backend for Workahomie: remote workers find people sharing a free home workspace nearby, send visit requests, chat and leave reviews.

## Setup

Requirements: Node 22 (`.nvmrc`), MongoDB 6+ (2dsphere index on `hosts.location`).

```bash
# from the repository root (npm workspaces)
npm install
cp services/server/.env.template services/server/.env   # fill in values
npm run start:dev --workspace=server                     # http://localhost:8000
```

| Script | Description |
| --- | --- |
| `npm run build --workspace=server` | Compile to `dist/` |
| `npm run start:prod --workspace=server` | Run `dist/main.js` |
| `npm test --workspace=server` | Unit tests (mocked models, no DB) |
| `npm run command --workspace=server -- <name>` | CLI: `seed:hosts`, `seed:reviews`, `seed:phones`, `seed:occupations`, `seed:pictures`, `update:hosts-rate` (dev deps required) |

Docker: `services/server/Dockerfile` (`development` target is used by `docker-compose.yml`; `production` installs only prod deps and copies `dist`).

## Environment variables

| Name | Notes |
| --- | --- |
| `DB_URI` | MongoDB connection string |
| `PORT` | Default `8000` |
| `CORS_ORIGINS` | Comma-separated allowed origins (HTTP + socket.io). Unset = allow all (logs a warning) |
| `AUTH0_ISSUER_URL`, `AUTH0_AUDIENCE` | Auth0 RS256 access-token validation (issuer URL ends with `/`) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER` | Image uploads |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Push notifications. Optional: missing → notifications disabled |
| `STRIPE_SECRET_KEY` | Donations. Optional: missing → `POST /payments/donate` returns 503 |
| `FRONTEND_URL` | Stripe success/cancel redirect |

## Conventions

- Auth: `Authorization: Bearer <Auth0 access token>`. The user id is the part after `|` in `sub` (`@CurrentUserId()`).
- `:id` params must be Mongo ObjectIds (400 otherwise).
- Lists return `{ data, total }` and accept `limit` / `offset`.
- Public host payloads never include `phone`.
- Global rate limit: 60 req/min per IP (`/payments/donate`: 5/min).

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | – | `{ status: 'ok', db: 'up' \| 'down' }` |
| GET | `/stats` | – | `{ hosts, reviews, connections, cities }`, cached 5 min (see below) |
| GET | `/hosts` | – | Search. Center `lat,lng` + `radius` km (default 10, max 200) and/or bbox `swLat,swLng,neLat,neLng`; `occupations`, `facilities` (comma lists), `rate`, `limit` (max 50), `offset`. With a center, sorted by distance and each item has `distance` (m) |
| GET | `/hosts/pins` | – | Same filters, bbox required (400), no pagination, max 1000: `{ data: [{ _id, location, firstName, lastName, occupation, rate, countReviews, picture }] }` |
| GET | `/hosts/wishlisted` | JWT | Same as `/hosts`, items include `isWishlisted` |
| GET | `/hosts/me` | JWT | Caller's host profile (includes phone) |
| POST | `/hosts` | JWT | Create host (multipart, optional `profile` image) |
| PUT | `/hosts/me` | JWT | Update profile (multipart, optional `profile` image) |
| PUT | `/hosts/me/place` | JWT | Update place (multipart): `placeDescription`, `placeDetails`, `address` (JSON with `lat`,`lon`), `facilities[]`, `existingPictures[]` (pictures to keep), `pictures` (≤10 new images) |
| DELETE | `/hosts/me` | JWT | Delete caller's host, its reviews and uploaded images |
| GET | `/hosts/:id` | – | Public host detail |
| POST | `/hosts/:id/requests` | JWT | `{ checkIn, checkOut, message?, userName?, userEmail?, userAvatar? }`. 400 own place / bad dates, 409 overlapping pending request |
| GET | `/hosts/:id/reviews` | – | Reviews of the host, newest first |
| GET | `/hosts/:id/reviews/eligibility` | JWT | `{ canReview, reason?: 'own_place' \| 'no_visit' \| 'already_reviewed' }` |
| POST | `/hosts/:id/reviews` | JWT | `{ review, rating (1-5), userName?, userAvatar? }`. Needs an accepted request with `checkIn <= now`; one per host |
| DELETE | `/reviews/:id` | JWT | Author only; recomputes host rating |
| GET | `/requests/outgoing` | JWT | Caller's requests, newest first (host phone only when `accepted`) |
| GET | `/requests/incoming` | JWT | Requests for the caller's place, newest first |
| GET | `/requests/:id` | JWT | Requester or host owner; includes messages |
| PUT / PATCH | `/requests/:id` | JWT | `{ status }`: host → `accepted` \| `declined`; requester → `cancelled`. 204 |
| DELETE | `/requests/:id` | JWT | Requester only |
| GET | `/wishlists` | JWT | Wishlisted host ids |
| GET | `/wishlists/full` | JWT | Wishlisted hosts (paginated) |
| POST | `/wishlists/add` | JWT | `{ hostId }` |
| DELETE | `/wishlists/remove` | JWT | `{ hostId }` |
| PUT | `/fcm-tokens` | JWT | `{ token }` register device for push |
| DELETE | `/fcm-tokens` | JWT | `{ token }` unregister (logout) |
| POST | `/payments/donate` | – | `{ amount }` integer euros 1-1000 → `{ url }` (Stripe Checkout) |

Geo notes: bbox uses `$geoWithin.$box` (lng/lat rectangle, like a map viewport); a box crossing the antimeridian (`swLng > neLng`) is clamped to `[swLng, 180]`. Center searches use `$geoNear` on the `location` 2dsphere index; when a bbox is also present the radius is ignored.

`/stats.cities` counts distinct host coordinates rounded to 1 decimal (~11 km cells), a cheap proxy for cities. `connections` = accepted requests.

## Socket.io (chat)

Connect to the API origin with `io(API_URL, { auth: { token: <Auth0 access token> } })`. The token is verified in a middleware before `connection`; invalid or missing tokens get `connect_error` `Unauthorized`.

| Direction | Event | Payload | Ack / notes |
| --- | --- | --- | --- |
| client → server | `join_room` | `requestId` | `{ ok: true }` or `{ ok: false, error }`. Only the requester or the host owner may join |
| client → server | `leave_room` | `requestId` | `{ ok: true }` |
| client → server | `send_message` | `{ requestId, message, userName?, userAvatar? }` | `{ ok: true, message }` or `{ ok: false, error }`. 1-2000 chars, sender must be a participant |
| server → room | `new_message` | `{ _id, requestId, userId, userName, userAvatar, userEmail, message, timeSent }` | Sent once to everyone in the room (sender included). `userId` comes from the token and `timeSent` is set by the server |

The other participant also gets a push notification when Firebase is configured.
