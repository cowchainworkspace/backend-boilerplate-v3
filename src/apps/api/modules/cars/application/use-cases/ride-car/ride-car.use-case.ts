import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Car } from '@domain/cars/car.entity';
import { IRideCarUseCase, ICarsRepository } from '../../contracts';

@Injectable()
export class RideCarUseCase implements IRideCarUseCase {
  constructor(
    @Inject(ICarsRepository) private readonly _carsRepo: ICarsRepository,
  ) {}

  async execute(command: { id: string }): Promise<Car> {
    const car = await this._carsRepo.getOneById(command.id);
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    //mocked domain logic just for example
    car.ride();

    const updatedCar = await this._carsRepo.incrementRidesCount(command.id);
    return updatedCar;
  }
}
