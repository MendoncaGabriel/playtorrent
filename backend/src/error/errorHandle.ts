import { FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(error: CustomError, req: FastifyRequest, res: FastifyReply) {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).send({
      error: true,
      message: error.message,
    });
  }

  // Para outros tipos de erros não tratados, retornar um erro genérico
  return res.status(500).send({
    error: true,
    message: 'Internal Server Error',
  });
}
