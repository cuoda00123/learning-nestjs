import { CreatePostDto } from './create.post.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Post id',
    example: 1234,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
