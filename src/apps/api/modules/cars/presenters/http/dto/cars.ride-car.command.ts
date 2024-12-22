import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CarBaseResponse } from './cars.base-response';
import { TCarModel } from '@shared/infrastructure/database/schemas';

export namespace RideCarCommand {
  export class Request {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    id: TCarModel['id'];
  }

  export class Response extends CarBaseResponse {}
}
