import { Injectable } from '@nestjs/common';

import { ICarsRepository } from '@shared/infrastructure/database/repositories/cars/cars.repository.contract';

import { IDeleteCarUseCase } from './delete-car.use-case.contract';

@Injectable()
export class DeleteCarUseCase implements IDeleteCarUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(command: { id: string }): Promise<void> {
    await this._carsRepo.delete(command.id);
  }
}
