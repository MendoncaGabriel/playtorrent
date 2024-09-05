export interface IHomePageRepository {
    execute(offsetNumber: number, limitNumber: number): Promise<any>;
}
  