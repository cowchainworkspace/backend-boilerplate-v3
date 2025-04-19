import { Provider } from '@nestjs/common';

import { GetCarsUseCase } from './get-cars.use-case';
import { IGetCarsUseCase } from './get-cars.use-case.contract';

export const GET_CARS_USE_CASE_PROVIDER: Provider = {
  provide: IGetCarsUseCase,
  useClass: GetCarsUseCase,
};
