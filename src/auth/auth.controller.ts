import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorators';
import { UserEntity } from './user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: UserEntity) {
    return {
      userId: user.id,
      token: this.authService.generateToken(user)
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser() user: UserEntity) {
    return user;
  }
}
