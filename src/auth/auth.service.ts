import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private readonly jwtService: JwtService) {
  }

  public generateToken(user: UserEntity): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
