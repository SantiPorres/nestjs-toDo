import { Global, Module, forwardRef } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TasksEntity } from './entities/tasks.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TasksEntity,
      UsersEntity
    ])
  ],
  providers: [TasksService, UsersService],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TasksModule {}
