import { HomePageUseCase } from '../../usecases/Home/HomePageUseCase';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IRotaController } from './IHomePageController';

interface QueryParams {
  offset?: string;
  limit?: string;
}

export class HomePageController implements IRotaController {   
  constructor(private homePageUseCase: HomePageUseCase) {}

  async homePage(req: FastifyRequest<{ Querystring: QueryParams }>, res: FastifyReply): Promise<void> {
    const { offset, limit } = req.query;

    try {
      // Converta os valores para números, se necessário
      const offsetNumber = offset ? parseInt(offset) : 0
      const limitNumber = limit ? parseInt(limit) : 20

      const dados = await this.homePageUseCase.executar(offsetNumber, limitNumber);

      return res.status(200).send(dados);

    } catch (error) {
      res.status(500).send({ error: 'Erro ao processar a solicitação' });
    }
  }
}
