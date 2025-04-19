import { Provider } from '@nestjs/common';

import { CarsRepository } from './cars.repo';
import { ICarsRepository } from './cars.repository.contract';

export const CARS_REPOSITORY_PROVIDER: Provider = {
  provide: ICarsRepository,
  useClass: CarsRepository,
};
