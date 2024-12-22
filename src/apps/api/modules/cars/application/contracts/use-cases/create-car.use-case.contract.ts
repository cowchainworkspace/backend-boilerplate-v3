import { IBaseUseCase } from '@shared/contracts/use-cases';
import { Car } from '@domain/cars/car.entity';

export abstract class ICreateCarUseCase extends IBaseUseCase<
  { model: string },
  Car
> {}
