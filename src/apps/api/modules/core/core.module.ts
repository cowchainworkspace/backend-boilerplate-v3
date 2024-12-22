import { Module } from '@nestjs/common';
import { CarsModule } from '../cars/cars.module';
import { ConfigurationModule } from '../configuration/configuration.module';

@Module({
  imports: [CarsModule, ConfigurationModule],
})
export class CoreModule {}
