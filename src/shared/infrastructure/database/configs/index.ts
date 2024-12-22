import { IsNotEmpty } from 'class-validator';
import { Config } from '@libs/configuration';

@Config()
export class DatabaseConfig {
  @IsNotEmpty()
  connectionString: string = process.env.POSTGRES_URL;
}
