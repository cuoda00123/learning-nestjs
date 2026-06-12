import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserParamDto {
  @ApiPropertyOptional({
    description: 'Get user with specific id',
    example: 1234,
    type: Number,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
