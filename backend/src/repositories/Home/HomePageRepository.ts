import Game from '../../models/Game';
import { IHomePageRepository } from './IHomePageRepository';

export class HomePageRepository implements IHomePageRepository {
  async execute(page: number, limit: number): Promise<any> {
    
    // Calcular o offset com base na página atual
    const offsetNumber = page * limit; 
    const data = await Game.find()
        .skip(offsetNumber)  // Pular documentos com base no cálculo do offset
        .limit(limit)        // Limitar o número de documentos retornados
        .exec();             // Executar a consulta

    return data;
  }
}
