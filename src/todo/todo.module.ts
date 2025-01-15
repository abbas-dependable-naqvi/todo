import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from 'src/entities/todo.entity'; // Import Todo entity
import { User } from 'src/entities/user.entity'; // Import User entity
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo, User]), // Register Todo and User entities
  ],
  controllers: [TodoController],
  providers: [TodoService, JwtService],
})
export class TodoModule {}
