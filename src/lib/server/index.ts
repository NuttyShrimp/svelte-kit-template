import { createTRPCSvelteServer } from 'trpc-svelte-query/server';
import { appRouter } from './routes/_app';
import { createContext } from './trpc';

export const trpcServer = createTRPCSvelteServer({
	endpoint: '/api/trpc',
	router: appRouter,
	createContext
});
