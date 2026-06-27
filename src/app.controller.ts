import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Auth } from './auth/decorator/auth.decorator';
import { AuthType } from './auth/enum/auth-type.enum';

@Controller()
@Auth(AuthType.None)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }
}
