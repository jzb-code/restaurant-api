# Restaurant API

- controllers / services / routes / validators
- Bearer API-Key auth
- Auto status progression: queued → baking → shipped → delivered (every 15s)
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
