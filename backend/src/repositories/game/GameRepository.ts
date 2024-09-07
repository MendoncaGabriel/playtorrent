import Game, { IGame } from '../../models/Game';
import { IGameRepository } from './IGameRepository';

export class GameRepository implements IGameRepository {
  async getGameByOffset(offset: number, limit: number): Promise<IGame[] | []> {
    const offsetIndex = offset * limit;
    const data = await Game.find()
      .skip(offsetIndex)
      .limit(limit)
      .exec();
    return data;
  }

  async getGameById(id: string): Promise<IGame | null> {
    const data = await Game.findById(id).exec()
    return data
  }

  async search(query: string): Promise<IGame[] | []> {
    const results = await Game.find({ $text: { $search: query } }).exec();
    return results
  }
}
