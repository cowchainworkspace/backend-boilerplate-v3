import { Provider } from '@nestjs/common';
import { DeleteCarUseCase } from './delete-car.use-case';
import { IDeleteCarUseCase } from '../../contracts';

export const DELETE_CAR_USE_CASE_PROVIDER: Provider = {
  provide: IDeleteCarUseCase,
  useClass: DeleteCarUseCase,
};
