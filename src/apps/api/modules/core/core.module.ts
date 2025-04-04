import { Module } from '@nestjs/common';
import { CarsModule } from '../cars/cars.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [CarsModule, ConfigurationModule, HealthModule],
})
export class CoreModule {}
