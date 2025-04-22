import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const authRouter = router({
  register: publicProcedure
    .input(z.object({ username: z.string(), password: z.string().min(6) }))
    .mutation(async ({ input }) => {
      const hashed = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: { username: input.username, password: hashed },
      });
      return { id: user.id, username: user.username };
    }),

  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { username: input.username } });
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error('Invalid credentials');
      }
      const token = signToken({ id: user.id, username: user.username });
      return { token };
    }),
});
