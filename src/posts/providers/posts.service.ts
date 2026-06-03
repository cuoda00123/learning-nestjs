import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    return [
      {
        title: 'title',
        content: 'content',
        authorId: user,
      },
      {
        title: 'title 2',
        content: 'content 2',
        authorId: user,
      },
    ];
  }
}
