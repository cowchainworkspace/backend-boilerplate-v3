import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TCarModel } from '@shared/infrastructure/database/schemas';

export namespace DeleteCarCommand {
  export class Request {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: TCarModel['id'];
  }
}
