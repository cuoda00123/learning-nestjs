import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create.post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch.post.dto';
import { postStatus, postType } from '../types/createPosts.enum';

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
    const author = await this.usersService.findOneById(createPostDto.authorId);

    const tags = await this.tagsService.findMultipleTags(createPostDto.tags!);

    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author!,
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
