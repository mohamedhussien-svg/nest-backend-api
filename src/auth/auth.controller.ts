import {
  BadRequestException,
  Body, ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorators';
import { UserEntity } from './user.entity';
import { AuthGuardJwt } from './auth.guard.jwt';
import { AuthGuardLocal } from './auth.guard.local';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';

@Controller('/auth')
@SerializeOptions({strategy:'excludeAll'})
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {
  }

  @Post('/login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: UserEntity) {
    return {
      userId: user.id,
      token: this.authService.generateToken(user)
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userService.registerUser(createUserDto);
  }

}
