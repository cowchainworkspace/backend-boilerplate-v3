import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { ConfigurationModule } from '../configuration/configuration.module';
import { HealthControllerV1 } from './presenters/http/dto/health.controller.v1';

@Module({
  imports: [TerminusModule, HttpModule, ConfigurationModule, DatabaseModule],
  controllers: [HealthControllerV1],
})
export class HealthModule {}
