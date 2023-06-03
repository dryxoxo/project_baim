import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUsersDto } from './dto/loginUsers.dto';
import { CreateUsersDto } from './dto/createUsers.dto';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Post('login')
    async login(@Body() loginUsersDto: LoginUsersDto) {
        return this.usersService.login(loginUsersDto);
    }

    @Post('register')
    async register(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.create(createUsersDto);
    }

}
