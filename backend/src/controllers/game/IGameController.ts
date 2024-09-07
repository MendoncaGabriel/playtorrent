import { FastifyRequest, FastifyReply } from 'fastify';
import { IGame } from '../../models/Game';

export interface IGameController {
  search(req: FastifyRequest, res: FastifyReply): Promise<IGame[] | []>;
  getByOffset(req: FastifyRequest, res: FastifyReply): Promise<IGame[] | []>;
  getById(req: FastifyRequest, res: FastifyReply): Promise<IGame | null>;

}
