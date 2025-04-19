import { Inject, Injectable } from '@nestjs/common';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { DRIZZLE_DATASOURCE_PROVIDER_TOKEN } from '../../drizzle/constants/injection-tokens';
import { TDatabaseSchema } from '../../schemas';

@Injectable()
export class BaseRepository {
  @Inject(DRIZZLE_DATASOURCE_PROVIDER_TOKEN)
  protected readonly _drizzle: NodePgDatabase<TDatabaseSchema>;
}
