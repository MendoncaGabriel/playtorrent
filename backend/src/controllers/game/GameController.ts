import { FastifyRequest, FastifyReply } from 'fastify';
import { GameUseCase } from '../../usecases/game/GameUseCase';
import { IGameController } from './IGameController';
import z from "zod"
import { IGame } from '../../models/Game';

interface GetByOffsetQueryRequest {
  offset?: string;
  limit?: string;
}

interface GetByIdParamsRequest {
  id: string
}

const getGameByIdParams = z.object({
  id: z.string()
})
const searchQuery = z.object({
  terms: z.string()
})

const getGameByOffsetQuery = z.object({
  offset: z.coerce.number().default(0),
  limit: z.coerce.number().default(20)
});


export class GameController implements IGameController {
  constructor(private gameUseCase: GameUseCase) { }

  async getByOffset(req: FastifyRequest<{ Querystring: GetByOffsetQueryRequest }>, res: FastifyReply): Promise<IGame[] | []> {
    const { offset, limit } = getGameByOffsetQuery.parse(req.query)
    const data = await this.gameUseCase.getGameByOffset(offset, limit);
    if (!data) throw new InternalServerError("Erro ao pegar jogos por offset")
    return res.status(200).send(data);
  }

  async getById(req: FastifyRequest<{ Params: GetByIdParamsRequest }>, res: FastifyReply): Promise<IGame | null> {
    const { id } = getGameByIdParams.parse(req.params)
    const data = await this.gameUseCase.getGameById(id)
    if (!data) throw new NotFoundError(`Jogo não encontrado com este id: ${id}`)
    return data
  }

  async search(req: FastifyRequest, res: FastifyReply): Promise<IGame[] | []> {
    const { terms } = searchQuery.parse(req.query)
    const data = await this.gameUseCase.search(terms)
    if (!data) throw new NotFoundError(`Jogo não encontrado`)
    return data
  }
}
