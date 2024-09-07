import { IGame } from "../../models/Game"

export interface IGameRepository {
    getGameById(id: string): Promise<IGame | null>;
    getGameByOffset(offsetNumber: number, limitNumber: number): Promise<IGame[] | []>;
    search(query: string): Promise<IGame[] | []>;
}
