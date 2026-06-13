import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  // Headers,
  // Ip,
  ParseIntPipe,
  DefaultValuePipe,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserParamDto } from './dto/get-users-param.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get(':id/:name')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users of application',
  })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'the number of items per page',
    example: 10,
  })
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
    //return this.usersService.findALl(getUserParamDto, page, offset);
    console.log(getUserParamDto);
    console.log(getUserParamDto.id);
    console.log(typeof getUserParamDto.id);

    return this.usersService.findALl(getUserParamDto, page, offset);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDto) {
    console.log(patchUserDto);
    return 'user patched , you send users patch request';
  }
}
