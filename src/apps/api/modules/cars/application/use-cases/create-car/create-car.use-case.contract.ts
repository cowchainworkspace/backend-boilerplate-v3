import { Car } from '@domain/cars/car.entity';
import { IBaseUseCase } from '@shared/contracts/use-cases';

export abstract class ICreateCarUseCase extends IBaseUseCase<{ model: string }, Car> {}
