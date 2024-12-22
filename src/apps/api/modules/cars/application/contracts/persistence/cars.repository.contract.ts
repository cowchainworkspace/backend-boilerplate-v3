import { Car } from '@domain/cars/car.entity';

export abstract class ICarsRepository {
  abstract create(car: { model: string }): Promise<Car>;
  abstract getAll(): Promise<Car[]>;
  abstract delete(id: string): Promise<void>;
  abstract getOneById(id: string): Promise<Car | undefined>;
  abstract incrementRidesCount(id: string): Promise<Car>;
}
