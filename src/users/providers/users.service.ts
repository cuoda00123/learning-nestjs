import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dto/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
/**
 * class to connect to users table and performn business operation
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // injecting usersRepository
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const existngUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }
  /**
   *
   * @param getUserParamDto
   * @param page
   * @param offset
   * @returns
   */
  public findALl(getUserParamDto: GetUserParamDto, page: number, offset: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      {
        firstName: 'Navneet',
        email: 'navneet@gmail.com',
      },
      {
        firstName: 'Navneet',
        email: 'navneet@gmail.com',
      },
    ];
  }

  /**
   *
   * @param id
   * @returns
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
