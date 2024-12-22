import { Injectable } from '@nestjs/common';
import { ICreateCarUseCase } from '../../contracts/use-cases/create-car.use-case.contract';
import { ICarsRepository } from '../../contracts/persistence/cars.repository.contract';
import { Car } from '@domain/cars/car.entity';

@Injectable()
export class CreateCarUseCase implements ICreateCarUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(command: { model: string }): Promise<Car> {
    return await this._carsRepo.create({ model: command.model });
  }
}
