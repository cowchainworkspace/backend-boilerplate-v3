import { Provider } from '@nestjs/common';
import { CreateCarUseCase } from './create-car.use-case';
import { ICreateCarUseCase } from '../../contracts';

export const CREATE_CAR_USE_CASE_PROVIDER: Provider = {
  provide: ICreateCarUseCase,
  useClass: CreateCarUseCase,
};
