import { IsDefined, IsString, MinLength } from 'class-validator';

export class CreateScreenDto {
  @IsString()
  app_id!: string;

  @IsString()
  @MinLength(1)
  screen_name!: string;

  @IsDefined()
  layout_json!: unknown;
}

