import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUserParamDto } from '../dto/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConf from '../config/profile.conf';
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

    @Inject(profileConf.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConf>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existngUser: User | null;

    try {
      existngUser = await this.usersRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in finding user, and error is ${error}`,
      });
    }

    if (existngUser) {
      throw new BadRequestException(`User with email ${createUserDto.email} already exist`, {
        description: `User with email ${createUserDto.email} already exist`,
      });
    }

    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in saving user, and error is ${error}`,
      });
    }

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
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API end point does not exist',
        fileName: 'users.service.ts',
        lineNumber: 81,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error('The API end point does not exist'),
        description: 'The API end point does not exist',
      },
    );
  }

  /**
   *
   * @param id
   * @returns
   */
  public async findOneById(id: number) {
    let user: User | null;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in finding user, and error is ${error}`,
      });
    }

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`, {
        description: `User with id ${id} not found`,
      });
    }

    return user;
  }
}
