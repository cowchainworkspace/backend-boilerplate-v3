import { ApiProperty } from '@nestjs/swagger';

import { TCarModel } from '@shared/infrastructure/database/schemas';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class CarBaseResponse {
  @ApiProperty({ description: 'Car id' })
  @IsString()
  id: TCarModel['id'];

  @ApiProperty({ description: 'Car model' })
  @IsString()
  model: TCarModel['model'];

  @ApiProperty({ description: 'Amount of rides that car made' })
  @IsInt()
  @IsPositive()
  ridesCount: TCarModel['ridesCount'];
}
