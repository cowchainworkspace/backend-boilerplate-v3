import { Car } from '@domain/cars/car.entity';
import { Injectable } from '@nestjs/common';
import { ICarsRepository } from '@shared/infrastructure/database/repositories/cars/cars.repository.contract';
import { IGetCarsUseCase } from './get-cars.use-case.contract';

@Injectable()
export class GetCarsUseCase implements IGetCarsUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(): Promise<Car[]> {
    return await this._carsRepo.getAll();
  }
}
