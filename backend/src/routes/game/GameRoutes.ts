import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify';
import { GameController } from '../../controllers/game/GameController';
import { GameUseCase } from '../../usecases/game/GameUseCase';
import { GameRepository } from '../../repositories/game/GameRepository';

interface getByOffsetSchema {
  offset?: string;
  limit?: string;
}

interface getByIdSchema {
  id: string
}

export async function IndexRoutes(app: FastifyInstance, options: FastifyPluginOptions) {
  const gameRepository = new GameRepository();
  const gameUseCase = new GameUseCase(gameRepository);
  const gameController = new GameController(gameUseCase);

  app.get('/', async (req, res) => {
    return await gameController.getByOffset(req as FastifyRequest<{ Querystring: getByOffsetSchema }>, res);
  });

  app.get('/:id', async (req, res) => {
    return await gameController.getById(req as FastifyRequest<{ Params: getByIdSchema }>, res);
  });

  app.get('/search', async (req, res) => {
    return await gameController.search(req as FastifyRequest<{ Params: getByIdSchema }>, res);
  });
}
