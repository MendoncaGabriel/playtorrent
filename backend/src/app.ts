import Fastify from 'fastify';
import { IndexRoutes } from './routes/Home/HomePage';
import "dotenv/config";
import "./config/database/mongodb";

const app = Fastify({
    logger: false
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
