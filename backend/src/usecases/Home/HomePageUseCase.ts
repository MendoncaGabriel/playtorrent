import { HomePageRepository } from '../../repositories/Home/HomePageRepository';
import { IBuscarRotaUseCase } from './IHomePageUseCase';

export class HomePageUseCase implements IBuscarRotaUseCase {
  constructor(private homePageRepository: HomePageRepository) {}

  async executar(offsetNumber: number, limitNumber: number): Promise<{ mensagem: string }> {
    return await this.homePageRepository.execute(offsetNumber, limitNumber);
  }
}
