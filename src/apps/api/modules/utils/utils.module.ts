import { Module } from '@nestjs/common';

import { DatabaseModule } from '@shared/infrastructure/database/database.module';

/**
 * Utility module for CLI operations (seeds, migrations, etc.)
 * Ensures that all necessary providers are available
 */
@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export class UtilsModule {}
