import { IGame } from "../../models/Game";

export interface IGameUseCase {
    search(query: string): Promise<IGame[] | []>;
    getGameByOffset(offsetNumber: number, limitNumber: number): Promise<IGame[] | []>;
    getGameById(id: string): Promise<IGame | null>;
}
  