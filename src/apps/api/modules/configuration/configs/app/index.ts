import { IsEnum, IsNumber } from 'class-validator';
import { AppEnvironment } from '@shared/types';
import { Config } from '@libs/configuration';

@Config()
export class AppConfig {
  @IsNumber()
  port: number = +process.env.PORT || 5001;

  @IsEnum(AppEnvironment)
  mode: AppEnvironment = process.env.ENVIRONMENT as AppEnvironment;
}
