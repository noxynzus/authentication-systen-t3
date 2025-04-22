import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { authRouter } from './routers/auth';
import { router } from './trpc';

const appRouter = router({ auth: authRouter });

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

app.listen(3001, () => {
  console.log('auth-service listening on port 3001');
});
