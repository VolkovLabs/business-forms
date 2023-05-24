import { v5 } from 'https://deno.land/std/uuid/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { faker } from 'https://deno.land/x/deno_faker@v1.0.3/mod.ts';
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

/**
 * Generated Feedback
 */
const types = ['issue', 'comment', 'feature'];
const namespace = '8acc3847-51e0-439f-a18c-24859fc68214';
const feedbacks: any = [];

Promise.all(
  [...Array(100).keys()].map(async (i) => {
    const id = await v5.generate(namespace, new TextEncoder().encode(i.toString()));

    feedbacks.push({
      id,
      name: faker.name.findName(),
      email: faker.internet.email(),
      type: types[Math.floor(Math.random() * types.length)],
      description: faker.lorem.sentences(),
    });
  })
);

/**
 * Router
 */
const router = new Router();
router
  .get('/', async (context) => {
    context.response.body = feedbacks;
  })
  .post('/', async (ctx) => {
    const token: string = ctx.request.headers.get('Authorization');
    const email: string = ctx.request.headers.get('Email');

    /**
     * Check Token
     */
    if (token !== Deno.env.get('TOKEN')!) {
      return new Response(`Unauthorized`, {
        status: 500,
      });
    }

    const { value } = ctx.request.body({ type: 'json' });
    const { name, type, description } = await value;
    const id = await v5.generate(namespace, new TextEncoder().encode(feedbacks.length().toString()));

    /**
     * Add Feedback
     */
    feedbacks.push({
      id,
      name,
      email,
      type,
      description,
    });

    ctx.response.body = feedbacks;
  });

/**
 * Application
 */
const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

/**
 * Start
 */
console.info('CORS-enabled web server listening on port 8000');
await app.listen({ port: 8000 });
