import { BadRequestException, Body, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create.post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch.post.dto';
import { postStatus, postType } from '../types/createPosts.enum';
import { User } from '../../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    let author: number;
    let tags: number[];

    try {
      author = await this.usersService.findOneById(createPostDto.authorId);
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in finding user, and error is ${error}`,
      });
    }

    if (!author) {
      throw new BadRequestException(`User with id ${createPostDto.authorId} not found`, {
        description: `User with id ${createPostDto.authorId} not found`,
      });
    }

    try {
      tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in finding tags, and error is ${error}`,
      });
    }

    if (!tags) {
      throw new BadRequestException(`Tags with ids ${createPostDto.tags} not found`, {
        description: `Tags with ids ${createPostDto.tags} not found`,
      });
    }

    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  public async findAllById(userId: number) {
    //const user = this.usersService.findOneById(userId);

    const posts = await this.postsRepository.find({
      where: {
        author: {
          id: userId,
        },
      },
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });

    return posts;
  }
  public async findAll() {
    return this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
  }

  public async update(patchPostDto: PatchPostDto) {
    // find the tags
    const tags = await this.tagsService.findMultipleTags(patchPostDto.tags!);

    // find the post
    const post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    //update the properties
    post!.title = (patchPostDto.title as string) ?? (post?.title as string);
    post!.slug = (patchPostDto.slug as string) ?? (post?.slug as string);
    post!.content = (patchPostDto.content as string) ?? (post?.content as string);
    post!.postType = (patchPostDto.postType as postType) ?? (post?.postType as postType);
    post!.status = (patchPostDto.status as postStatus) ?? (post?.status as postStatus);
    post!.featuredImageUrl =
      (patchPostDto.featuredImageUrl as string) ?? (post?.featuredImageUrl as string);
    post!.publishOn = (patchPostDto.publishOn as Date) ?? (post?.publishOn as Date);

    //assign the new tags
    post!.tags = tags;

    //save the post and return
    return await this.postsRepository.save(post!);
  }
  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
