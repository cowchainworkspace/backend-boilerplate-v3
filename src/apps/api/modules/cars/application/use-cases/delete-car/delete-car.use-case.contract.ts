import { IBaseUseCase } from '@shared/contracts';

export abstract class IDeleteCarUseCase extends IBaseUseCase<
  { id: string },
  void
> {}
