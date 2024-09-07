import Fastify from 'fastify';
import { IndexRoutes } from './routes/game/GameRoutes';
import "dotenv/config";
import "./config/database/mongodb";
import { errorHandler } from './error/errorHandle';
import path from 'path';
import fastifyStatic from '@fastify/static';


const app = Fastify({
    logger: false
});

app.setErrorHandler(errorHandler);

const staticDir = path.join(__dirname, 'storage/images');

app.register(fastifyStatic, {
    root: staticDir,
    prefix: '/images/',
});


app.register(IndexRoutes, { prefix: "/" });

app.listen({
    host: '0.0.0.0',
    port: 3333
})
    .then(host => console.log(`Server running at ${host}`))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
