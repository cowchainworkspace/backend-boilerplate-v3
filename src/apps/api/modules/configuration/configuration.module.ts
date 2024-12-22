import { Global, Module } from '@nestjs/common';
import { CONFIGS } from './configs';

@Global()
@Module({
  providers: [...CONFIGS],
  exports: [...CONFIGS],
})
export class ConfigurationModule {}
