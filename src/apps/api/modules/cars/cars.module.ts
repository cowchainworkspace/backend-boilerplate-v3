import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { SeedRegistry } from '@shared/infrastructure/database/seeds/seed.registry';

import {
  CREATE_CAR_USE_CASE_PROVIDER,
  DELETE_CAR_USE_CASE_PROVIDER,
  GET_CARS_USE_CASE_PROVIDER,
  RIDE_CAR_USE_CASE_PROVIDER,
} from './application/use-cases';
import { CarsSeed } from './infrastructure/seeds/cars.seed';
import { CarsControllerV1 } from './presenters/http/cars.controller.v1';

@Module({
  controllers: [CarsControllerV1],
  providers: [
    CREATE_CAR_USE_CASE_PROVIDER,
    DELETE_CAR_USE_CASE_PROVIDER,
    GET_CARS_USE_CASE_PROVIDER,
    RIDE_CAR_USE_CASE_PROVIDER,
    CarsSeed,
    {
      provide: 'SEED_REGISTRATION',
      useFactory: (seedRegistry: SeedRegistry, carsSeed: CarsSeed) => {
        seedRegistry.register(carsSeed);
      },
      inject: [SeedRegistry, CarsSeed],
    },
  ],
  imports: [DatabaseModule],
})
export class CarsModule {}
