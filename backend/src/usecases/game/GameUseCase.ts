import { IGame } from '../../models/Game';
import { GameRepository } from '../../repositories/game/GameRepository';
import { IGameUseCase } from './IGameUseCase';

export class GameUseCase implements IGameUseCase {
  constructor(private gameRepository: GameRepository) { }

  async getGameByOffset(offsetNumber: number, limitNumber: number): Promise<IGame[] | []> {
    return await this.gameRepository.getGameByOffset(offsetNumber, limitNumber);
  }

  async getGameById(id: string): Promise<IGame | null> {
    return await this.gameRepository.getGameById(id)
  }

  async search(query: string): Promise<IGame[] | []> {
    return await this.gameRepository.search(query)
  }

}
