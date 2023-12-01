import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { TasksModule } from 'src/tasks/tasks.module';


@Module({
  imports: [
    forwardRef(() => TasksModule),
    TypeOrmModule.forFeature([
      UsersEntity
    ])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
