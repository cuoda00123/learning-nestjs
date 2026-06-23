import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signin.dto';
import { HashingProvider } from './hashing.provider';
// import { JwtService } from '@nestjs/jwt';
// import type { ConfigType } from '@nestjs/config';
// import jwtConfig from '../config/jwt.config';
import { GenerateTokenProvider } from './generate-token.provider';
// import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class SigninProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    @Inject(HashingProvider)
    private readonly hashingProvider: HashingProvider,

    // //inject hashing service
    // private readonly jwtService: JwtService,

    // // inject jwt configuration
    // @Inject(jwtConfig.KEY)
    // private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    //inject generate token provider
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    // find the user using email
    // throw an error if user is not found
    const user = await this.userService.findOneByEmail(signInDto.email);
    // compare password
    let isEqual: boolean = false;
    try {
      isEqual = await this.hashingProvider.comparePassword(signInDto.password, user.password!);
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in comparing password, and error is ${error}`,
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password is not correct');
    }
    // return token

    return await this.generateTokenProvider.generateToken(user);
  }
}
