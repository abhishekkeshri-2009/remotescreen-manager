import { IsString, MinLength } from 'class-validator';

export class CreateAppDto {
  @IsString()
  @MinLength(1)
  name!: string;
}

