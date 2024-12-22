export abstract class IBaseUseCase<Command, Result> {
  abstract execute(command?: Command): Promise<Result>;
}
