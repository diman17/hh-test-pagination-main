import { UserService } from './users.service';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import {UsersResponseDto} from "./users.response.dto";

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    this.logger.log('Get all users with pagination');

    const { users, total } = await this.userService.findAll({
      page: Number(page),
      limit: Number(limit),
    });

    return {
      users: users.map((user) => UsersResponseDto.fromUsersEntity(user)),
      total,
    };
  }
}
