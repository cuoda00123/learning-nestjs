import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create.post.dto';
import { UsersService } from '../../users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from '../../auth/interfaces/active-user-data.interface';
import { User } from '../../users/user.entity';
import { Tag } from '../../tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    private readonly tagsService: TagsService,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author: User | null = null;
    let tags: Tag[] | null = null;

    try {
      author = await this.usersService.findOneById(user.sub);

      if (!author) {
        throw new BadRequestException(`User with id ${user.sub} not found`);
      }

      tags = await this.tagsService.findMultipleTags(createPostDto.tags!);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (tags.length !== createPostDto.tags!.length) {
      throw new BadRequestException('Please provide valid tags');
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      author,
      tags,
    });

    try {
      return this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: `Error in saving post, and error is ${error}`,
      });
    }
  }
}
