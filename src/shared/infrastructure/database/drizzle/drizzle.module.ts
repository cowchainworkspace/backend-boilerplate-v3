import { Module } from '@nestjs/common';

import { DRIZZLE_DATASOURCE_PROVIDER } from './drizzle-datasource.provider';
import { ConfigurableDrizzleModule } from './drizzle.module-definition';

@Module({
  providers: [DRIZZLE_DATASOURCE_PROVIDER],
  exports: [DRIZZLE_DATASOURCE_PROVIDER],
})
export class DrizzleModule extends ConfigurableDrizzleModule {
  constructor() {
    super();
  }
}
