import { Provider } from '@nestjs/common';
import { CarsRepository } from './cars.repo';
import { ICarsRepository } from '@apps/api/modules/cars/application/contracts';

export const CARS_REPOSITORY_PROVIDER: Provider = {
  provide: ICarsRepository,
  useClass: CarsRepository,
};
