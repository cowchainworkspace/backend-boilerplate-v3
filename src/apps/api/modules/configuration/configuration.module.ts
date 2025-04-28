import { Global, Module } from '@nestjs/common';

import { DatabaseConfig } from '@shared/infrastructure/database/configs';

import { AppConfig } from './app';

@Global()
@Module({
  providers: [AppConfig, DatabaseConfig],
  exports: [AppConfig, DatabaseConfig],
})
export class ConfigurationModule {}
