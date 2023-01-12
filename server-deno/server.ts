import { v4 } from 'https://deno.land/std/uuid/mod.ts';
import { oakCors } from 'https://deno.land/x/cors/mod.ts';
import { faker } from 'https://deno.land/x/deno_faker@v1.0.3/mod.ts';
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';

/**
 * Generated Feedback
 */
const types = ['issue', 'comment', 'feature'];
const feedbacks = [...Array(100).keys()].map(() => {
  return {
    id: v4.generate(),
    name: faker.name.findName(),
    email: faker.internet.email(),
    type: types[Math.floor(Math.random() * types.length)],
    description: faker.lorem.sentences(),
  };
});

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

    const id = v4.generate();
    const { value } = ctx.request.body({ type: 'json' });
    const { name, type, description } = await value;

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
