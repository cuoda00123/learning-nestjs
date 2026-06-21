import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../constants/auth.constants';
import { User } from '../../../users/user.entity';
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    //inject jwtservice
    private readonly jwtService: JwtService,

    //inject jwt configuration
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // extract the request token from the execution context
    const request: Request = context.switchToHttp().getRequest();

    //extract the token from header from the request
    const token = this.extractTokenFromHeader(request);

    //verify the token
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: User = await this.jwtService.verifyAsync(token, this.jwtConfiguration);
      request[REQUEST_USER_KEY] = payload;
      //console.log(payload);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
