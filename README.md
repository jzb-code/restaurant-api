# Restaurant API (Hono + Zod, structured)

- controllers / services / routes / validators
- JWT auth
- Auto status progression: queued → baking → shipped → delivered (every 3s)
- Vitest integration tests (validate requests & responses with Zod)

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

## Test

```bash
npm test
```
