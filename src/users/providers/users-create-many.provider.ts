import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dto/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // inject database
    private readonly dataSource: DataSource,
  ) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    // create query runner instance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      //connect query runner to database
      await queryRunner.connect();

      //start tr
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException(`Something went worng, please try again later`, {
        description: `Error in connecting to database, and error is ${error}`,
      });
    }
    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //if successful, then commit
      await queryRunner.commitTransaction();
    } catch (error) {
      //if not successful, then rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Not complete the transaction', {
        description: `Error in transaction, and error is ${error}`,
      });
    } finally {
      //release connection
      await queryRunner.release();
    }
    return newUsers;
  }
}
