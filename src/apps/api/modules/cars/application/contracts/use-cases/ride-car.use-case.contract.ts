import { IBaseUseCase } from '@shared/contracts/use-cases';
import { Car } from '../../../../../../../domain/cars/car.entity';

export abstract class IRideCarUseCase extends IBaseUseCase<
  { id: string },
  Car
> {}
