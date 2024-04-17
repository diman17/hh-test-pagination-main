import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UsersEntity)
    private usersRepo: Repository<UsersEntity>,
  ) {}

  // get list of all users with total count
  async findAll({ page, limit }): Promise<{ users: UsersEntity[], total: number }> {
    const [result, total] = await this.usersRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  
    return {
      users: result,
      total,
    };
  }
}
