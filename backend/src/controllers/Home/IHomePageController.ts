import { FastifyRequest, FastifyReply } from 'fastify';

export interface IRotaController {
  homePage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}
