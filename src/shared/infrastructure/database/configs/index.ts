import { Config } from '@libs/configuration';
import { IsNotEmpty } from 'class-validator';

@Config()
export class DatabaseConfig {
  @IsNotEmpty()
  connectionString: string = process.env.POSTGRES_URL;
}
