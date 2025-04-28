import { Provider } from '@nestjs/common';

import { RideCarUseCase } from './ride-car.use-case';
import { IRideCarUseCase } from './ride-car.use-case.contract';

export const RIDE_CAR_USE_CASE_PROVIDER: Provider = {
  provide: IRideCarUseCase,
  useClass: RideCarUseCase,
};
