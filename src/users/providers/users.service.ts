import {
  //BadRequestException,
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
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConf from '../config/profile.conf';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dto/create-many-users.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';

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

    // inject database
    private readonly dataSource: DataSource,

    // inject UsersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // inject create user provider
    private readonly createUserProvider: CreateUserProvider,

    // inject FindOneUserByEmailProvider
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,

    // inject findonebygoogleid provider
    private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,

    //inject create google user provider
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
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

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneByGoogleId(GoogleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(GoogleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
