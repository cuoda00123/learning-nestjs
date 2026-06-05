import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create.post.dto';
import { PatchPostDto } from './dto/patch.post.dto';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('/{:id}')
  public getPosts(@Param() id: string) {
    return this.postsService.findAll(id);
  }

  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
    return createPostDto;
  }

  @ApiOperation({
    summary: 'update post',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully updated.',
  })
  @Patch()
  public patchPost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
  }
}
