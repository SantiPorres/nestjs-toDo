import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { UsersService } from 'src/users/services/users.service';
import { TasksEntity } from './entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TasksEntity,
      UsersEntity
    ])
  ],
  providers: [TasksService, UsersService],
  controllers: [TasksController]
})
export class TasksModule {}
