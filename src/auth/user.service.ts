import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
              private readonly authService: AuthService) {
  }

  public async findByUsernameOrEmail(username: string, email: string): Promise<UserEntity | null> {

    return await this.userRepository.findOneBy([
      { username: username },
      { email: email }
    ]);
  }

  async registerUser(createUserDto: CreateUserDto) {
    this.logger.log(createUserDto);
    if (createUserDto.password !== createUserDto.retypePassword) {
      this.logger.log(createUserDto)
      throw new BadRequestException('password not matched with retype password');
    }
    const userEntity = await this.findByUsernameOrEmail(createUserDto.username, createUserDto.email);
    if (userEntity) {
      throw new BadRequestException('username or email is taken');
    }
    const user: UserEntity = new UserEntity();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.password = await this.authService.hashPassword(createUserDto.password);

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.generateToken(user)
    };

  }
}
