import FastifyMiddie from '@fastify/middie';
import Fastify from 'fastify';
import { handler } from '../build/handler.js';

const fastify = Fastify({
	logger: true
});

await fastify.register(FastifyMiddie, {
	hook: 'onRequest'
});

fastify.use(handler);

const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};
start();
