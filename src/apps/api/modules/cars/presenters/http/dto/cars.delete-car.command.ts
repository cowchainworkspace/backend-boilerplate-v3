import { ApiProperty } from '@nestjs/swagger';

import { TCarModel } from '@shared/infrastructure/database/schemas';
import { IsNotEmpty, IsString } from 'class-validator';

export namespace DeleteCarCommand {
  export class Request {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: TCarModel['id'];
  }
}
