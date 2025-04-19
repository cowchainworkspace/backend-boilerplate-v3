import { Module } from '@nestjs/common';

import { LoggerModule } from '@shared/infrastructure/logger';

import { CarsModule } from '../cars/cars.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { HealthModule } from '../health/health.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    LoggerModule,
    ConfigurationModule,
    UtilsModule, // Add UtilsModule for seeds, migrations, etc.
    CarsModule,
    HealthModule,
  ],
})
export class CoreModule {}
