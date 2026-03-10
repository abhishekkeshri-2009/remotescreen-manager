import { IsDefined, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateScreenDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  screen_name?: string;

  @IsOptional()
  @IsDefined()
  layout_json?: unknown;
}

