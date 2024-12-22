import { Injectable } from '@nestjs/common';
import { ICarsRepository, IDeleteCarUseCase } from '../../contracts';

@Injectable()
export class DeleteCarUseCase implements IDeleteCarUseCase {
  constructor(private readonly _carsRepo: ICarsRepository) {}

  async execute(command: { id: string }): Promise<void> {
    return await this._carsRepo.delete(command.id);
  }
}
