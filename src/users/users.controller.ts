import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/{:id}/{:name}')
  public getUsers(
    @Param() getUserParamDto: GetUserParamDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('offset', new DefaultValuePipe(10), ParseIntPipe) offset: number,
  ) {
    // console.log(getUserParamDto);
    // console.log(typeof getUserParamDto);
    // console.log(page);
    // console.log(typeof page);
    // console.log(offset);
    // console.log(typeof offset);
    // return 'all users are here , you send users get request';
    return this.usersService.findALl(getUserParamDto, page, offset);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto, @Headers() headers: any, @Ip() ip: any) {
    console.log(createUserDto);
    console.log(typeof createUserDto);
    console.log(createUserDto instanceof CreateUserDto);
    return 'user created , you send users post request';
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'user patched , you send users patch request';
  }
}
