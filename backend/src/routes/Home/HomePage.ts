import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { HomePageController } from '../../controllers/Home/HomePageController';
import { HomePageUseCase } from '../../usecases/Home/HomePageUseCase';
import { HomePageRepository } from '../../repositories/Home/HomePageRepository';

interface QueryParams {
  offset?: string;
  limit?: string;
}

export async function IndexRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const rotaRepository = new HomePageRepository();
  const homePageUseCase = new HomePageUseCase(rotaRepository);
  const homePageController = new HomePageController(homePageUseCase);

  fastify.get('/', async (req, res) => {
    return await homePageController.homePage(req as FastifyRequest<{ Querystring: QueryParams }>, res);
  });
}
