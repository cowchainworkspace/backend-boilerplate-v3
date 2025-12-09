import { Config } from '@libs/configuration';
import { AppEnvironment } from '@shared/types';
import { IsBoolean, IsEnum, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

import { staticConfig } from '../static';

@Config()
export class AppConfig {
  @IsNumber()
  port: number = +process.env.PORT || 5001;

  @IsEnum(AppEnvironment)
  mode: AppEnvironment = process.env.ENVIRONMENT as AppEnvironment;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  appName: string = staticConfig.APP_NAME;

  @IsString()
  @MinLength(3)
  @MaxLength(150)
  description: string = staticConfig.APP_DESCRIPTION;

  @IsBoolean()
  useNewLinesInLogger: boolean = false;
}
