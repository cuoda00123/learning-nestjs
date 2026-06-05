import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUserParamDto } from '../dto/get-users-param.dto';
import { AuthService } from '../../auth/providers/auth.service';
/**
 * class to connect to users table and performn business operation
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

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
