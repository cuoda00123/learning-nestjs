import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus, postType } from '../types/createPosts.enum';
import { CreatePostMetaOptionsDto } from './create-post-metaOptions.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'New Update in nestjs',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    enum: postType,
    description: 'Post typ, their possible values are post | page | story | series',
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
    example: ['tag1', 'tag2'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'Array',
    required: false,
    description: 'Post meta options',
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Meta option key',
          example: 'author',
        },
        value: {
          type: 'any',
          description: 'Meta option value',
          example: 'John Doe',
        },
      },
    },
    example: [
      {
        key: 'author',
        value: 'John Doe',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
