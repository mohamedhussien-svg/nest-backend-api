import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ username });
    if (!user) {
      this.logger.debug(`username not found : ${username}`);
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`wrong password not found : ${username}`);
      throw new UnauthorizedException();
    }

    return user;
  }

}
