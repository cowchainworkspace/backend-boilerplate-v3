import { Injectable } from '@nestjs/common';

import { Car } from '@domain/cars/car.entity';
import { ICarsRepository } from '@shared/infrastructure/database/repositories/cars/cars.repository.contract';

import { ICreateCarUseCase } from './create-car.use-case.contract';

@Injectable()
export class CreateCarUseCase implements ICreateCarUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(command: { model: string }): Promise<Car> {
    const car = await this._carsRepo.create({ model: command.model });
    return car;
  }
}
