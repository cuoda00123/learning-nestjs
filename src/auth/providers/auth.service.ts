import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInDto } from '../dto/signin-dto';
import { SigninProvider } from './signin-provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // inject sign in provider
    private readonly signinProvider: SigninProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signinProvider.signIn(signInDto);
  }

  public isAuth() {
    return true;
  }
}
