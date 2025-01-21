import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from 'src/auth/auth.repository';
import { TodoRepository } from './todo.repository';

@Module({
  controllers: [TodoController],
  providers: [TodoService, JwtService, AuthRepository, TodoRepository],
})
export class TodoModule {}
