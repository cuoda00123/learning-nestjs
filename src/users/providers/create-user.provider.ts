import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { MailService } from '../../mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // inject hashing provider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    // inject the mail service
    private readonly mailService: MailService,
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
      throw new BadRequestException(`Something went worng, please try again later`, {
        description: `Error in finding user, and error is ${error}`,
      });
    }

    if (existngUser) {
      throw new BadRequestException(`User with email ${createUserDto.email} already exist`, {
        description: `User with email ${createUserDto.email} already exist`,
      });
    }

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new BadRequestException(`Something went worng, please try again later`, {
        description: `Error in saving user, and error is ${error}`,
      });
    }
    try {
      await this.mailService.sendWelcomeMail(newUser);
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in sending mail, and error is ${error}`,
      });
    }
    return newUser;
  }
}
