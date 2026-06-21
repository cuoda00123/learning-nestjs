import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from '../../enum/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    const authTypes: AuthType[] = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? [AuthenticationGuard.defaultAuthType];

    //show authTypes
    //console.log(authTypes);

    // array of guards
    const guards = authTypes.map((authType) => this.authTypeGuardMap[authType]).flat();
    //console.log(guards);

    // default error
    const error = new UnauthorizedException();

    // loop guards canActivate
    for (const instance of guards) {
      //console.log(instance);
      const canActivate = await Promise.resolve(instance.canActivate(context)).catch((err) => {
        error : err;
        return false;
      });
      //console.log(canActivate);
      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
