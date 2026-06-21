import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dto/create.post.dto';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch.post.dto';
// import { postStatus, postType } from '../types/createPosts.enum';
// import { User } from '../../users/user.entity';
// import { Tag } from '../../tags/tag.entity';
import { getPostsDto } from '../dto/get-post.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { paginated } from '../../common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,

    //inject create post provider
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return this.createPostProvider.create(createPostDto, user);
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
  public async findAll(userId: number, postQuery?: getPostsDto): Promise<paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      { limit: postQuery?.limit, page: postQuery?.page },
      this.postsRepository,
    );

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    const post = await this.postsRepository.findOne({
      where: { id: patchPostDto.id },
      relations: ['tags'],
    });

    if (!post) {
      throw new BadRequestException(`Post with id ${patchPostDto.id} not found`);
    }

    if (patchPostDto.tags?.length) {
      const tags = await this.tagsService.findMultipleTags(patchPostDto.tags);

      if (tags.length !== patchPostDto.tags.length) {
        throw new BadRequestException('Please provide valid tags');
      }

      post.tags = tags;
    }

    post.title = patchPostDto.title ?? post.title;
    post.slug = patchPostDto.slug ?? post.slug;
    post.content = patchPostDto.content ?? post.content;
    post.postType = patchPostDto.postType ?? post.postType;
    post.status = patchPostDto.status ?? post.status;
    post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    return this.postsRepository.save(post);
  }
  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
