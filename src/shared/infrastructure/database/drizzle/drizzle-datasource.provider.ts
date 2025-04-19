import { Provider } from '@nestjs/common';

import { drizzle } from 'drizzle-orm/node-postgres';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from './constants/injection-tokens';
import { DRIZZLE_OPTIONS } from './drizzle.module-definition';
import { TDrizzleOptions } from './types';

export const DRIZZLE_DATASOURCE_PROVIDER: Provider = {
  provide: DRIZZLE_DATASOURCE_PROVIDER_TOKEN,
  useFactory: (options: TDrizzleOptions) => {
    return drizzle(...options);
  },
  inject: [DRIZZLE_OPTIONS],
};
