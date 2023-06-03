import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/createUsers.dto';
import { LoginUsersDto } from './dto/loginUsers.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(createUsersDto: CreateUsersDto): Promise<any> {
    const { name, username, password, is_admin } = createUsersDto;

    let user = await this.usersRepository.findOne({
      where: { username: username },
    });

    if (user) {
      throw new ConflictException(`Username ${username} already used`);
    }

    let isAdmin = false; // Default value is false

    if (typeof is_admin === 'string' && is_admin.toLowerCase() === 'true') {
      isAdmin = true;
    }

    const newUser = this.usersRepository.create({
      name,
      username,
      password: await bcrypt.hash(password, 10),
      is_admin: isAdmin,
    });

    const savedUser = await this.usersRepository.save(newUser);
    const { password: omittedPassword, ...userData } = savedUser;

    return {
      success: true,
      message: 'User successfully registered',
      data: userData,
    };
  }

  async login(loginUsersDto: LoginUsersDto): Promise<any> {
    const { username, password } = loginUsersDto;
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });

    const token = jwt.sign(
      { id: user.id, role: user.is_admin },
      process.env.SECRET_KEY,
    );

    if (!user) {
      throw new ConflictException(`Username ${username} not found`);
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ConflictException(`Password is incorrect`);
    }

    return {
      success: true,
      message: 'User successfully registered',
      data: {
        user: user.username,
        token: token,
      },
    };
  }
}
