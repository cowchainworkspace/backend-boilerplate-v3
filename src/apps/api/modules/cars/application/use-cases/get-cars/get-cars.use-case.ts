import { Injectable } from '@nestjs/common';
import { ICarsRepository, IGetCarsUseCase } from '../../contracts';
import { Car } from '@domain/cars/car.entity';

@Injectable()
export class GetCarsUseCase implements IGetCarsUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(): Promise<Car[]> {
    return await this._carsRepo.getAll();
  }
}
