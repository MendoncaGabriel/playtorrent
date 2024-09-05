export interface IBuscarRotaUseCase {
    executar(offsetNumber: number, limitNumber: number): Promise<{ mensagem: string }>;
}
  