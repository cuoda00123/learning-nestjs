import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
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

  public findOneById(id: string) {
    return [
      {
        id: id,
        firstName: 'Navneet',
        email: 'navneet@gmail.com',
      },
    ];
  }
}
