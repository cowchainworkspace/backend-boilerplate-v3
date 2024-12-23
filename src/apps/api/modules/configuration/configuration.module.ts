import { Global, Module } from '@nestjs/common';
import { AppConfig } from './app';
import { DatabaseConfig } from '@shared/infrastructure/database/configs';

@Global()
@Module({
  providers: [AppConfig, DatabaseConfig],
  exports: [AppConfig, DatabaseConfig],
})
export class ConfigurationModule {}
