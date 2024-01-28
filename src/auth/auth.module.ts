import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { UserEntity } from './user.entity';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m'
        }
      })
    })],
  providers: [LocalStrategy, JwtStrategy, AuthService, UserService],
  controllers: [AuthController]
})
export class AuthModule {
}
