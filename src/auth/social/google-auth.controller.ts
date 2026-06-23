import { Body, Controller, Post } from '@nestjs/common';
import { GoogleAuthService } from './providers/google-auth.service';
import { GoogleTokenDto } from './dto/google-token.dto';
import { Auth } from '../decorator/auth.decorator';
import { AuthType } from '../enum/auth-type.enum';

@Auth(AuthType.None)
@Controller('auth/google-auth')
export class GoogleAuthController {
  constructor(
    //inject google auth service
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post()
  public authenticate(@Body() googleTokenDto: GoogleTokenDto) {
    return this.googleAuthService.authenticate(googleTokenDto);
  }
}
