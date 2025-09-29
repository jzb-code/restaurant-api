import {serve} from '@hono/node-server';
import {createApp} from './app.js';

async function main() {
    const app = createApp();
    const port = Number(process.env.PORT || 4000);
    console.log(`Listening on http://localhost:${port}`);
    serve({fetch: app.fetch, port});
}

main().catch((e) => {
    console.error('Failed to start', e);
    process.exit(1);
});
