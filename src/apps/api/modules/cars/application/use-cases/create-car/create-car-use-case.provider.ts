import { Provider } from '@nestjs/common';

import { CreateCarUseCase } from './create-car.use-case';
import { ICreateCarUseCase } from './create-car.use-case.contract';

export const CREATE_CAR_USE_CASE_PROVIDER: Provider = {
  provide: ICreateCarUseCase,
  useClass: CreateCarUseCase,
};
