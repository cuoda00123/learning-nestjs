import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus, postType } from '../types/createPosts.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dto/create-post-metaOptions.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'New Update in nestjs',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Post type, their possible values are post | page | story | series',
    example: 'post',
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'Post slug',
    example: 'new-update-in-nestjs',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Invalid slug',
  })
  @MaxLength(512)
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: 'Post status, their possible values are draft | published | review | scheduled',
    example: 'published',
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @ApiPropertyOptional({
    description: 'Post content',
    example: 'content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Post schema',
    example: 'schema',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Post featured image url',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Post publish date',
    example: '2022-01-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Post tags',
    example: [1, 2],
  })
  @IsOptional()
  @IsInt({ each: true }) // Validate each tag as an integer()
  @IsArray()
  tags?: number[];

  @ApiPropertyOptional({
    type: 'object',
    required: false,
    description: 'Post meta options',
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metaValue is a json string',
          example: '{"sidebar": "true"}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;

  @IsInt()
  @ApiProperty({
    type: 'integer',
    required: true,
    example: 2,
  })
  authorId: number;
}
