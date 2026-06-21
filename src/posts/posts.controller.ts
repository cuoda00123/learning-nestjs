import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create.post.dto';
import { PatchPostDto } from './dto/patch.post.dto';
import { getPostsDto } from './dto/get-post.dto';
import { ActiveUser } from '../auth/decorator/active-users.decorator';
import type { ActiveUserData } from '../auth/interfaces/active-user-data.interface';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // @Get()
  // public getPosts() {
  //   return this.postsService.findAll();
  // }

  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto, @ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.postsService.create(createPostDto, user);
  }
  // public createPost(@Req() request) {
  //   console.log(request[REQUEST_USER_KEY]);
  // }
  @Get('{/:userId}')
  findAllById(
    @Param('userId')
    userId: number,
    @Query() postQuery: getPostsDto,
  ) {
    return this.postsService.findAll(userId, postQuery);
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
    return this.postsService.update(patchPostDto);
  }

  @Delete('/:id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
