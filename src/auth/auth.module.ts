import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/services/users.service';
import { UsersEntity } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => TasksModule),
    TypeOrmModule.forFeature([
      UsersEntity
    ])
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController]
})
export class AuthModule {}
