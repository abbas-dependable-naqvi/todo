import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './../entities/todo.entity';
import { User } from './../entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoState } from './../entities/todo.entity';
import { plainToClass } from 'class-transformer';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createTodoPayload: CreateTodoDto): Promise<Todo> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createTodoPayload.userId },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${createTodoPayload.userId} not found`,
        );
      }

      const state = createTodoPayload.state ?? TodoState.PENDING;

      const todo = this.todoRepository.create({
        title: createTodoPayload.title,
        description: createTodoPayload.description,
        state: state,
        userId: createTodoPayload.userId,
        user: user,
      });

      const savedTodo = await this.todoRepository.save(todo);

      const sanitizedTodo = plainToClass(Todo, savedTodo, {
        excludeExtraneousValues: true,
      });

      return sanitizedTodo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while saving the todo',
      );
    }
  }

  async find(todoID: number, userID: number) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoID },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${todoID} not found`);
    }

    if (todo.userId !== userID) {
      throw new UnauthorizedException("You don't have access to this todo");
    }

    const sanitizedTodo = plainToClass(Todo, todo, {
      excludeExtraneousValues: true,
    });

    return sanitizedTodo;
  }

  async findAll(filters: {
    userId?: number;
    state?: TodoState;
    title?: string;
  }): Promise<Todo[]> {
    try {
      const { userId, state, title } = filters;

      const queryBuilder = this.todoRepository.createQueryBuilder('todo');

      if (userId) {
        queryBuilder.andWhere('todo.userId = :userId', { userId });
      }

      if (state) {
        queryBuilder.andWhere('todo.state = :state', { state });
      }

      if (title) {
        queryBuilder.andWhere('todo.title LIKE :title', {
          title: `%${title}%`,
        });
      }

      const todos = await queryBuilder.getMany();

      return plainToClass(Todo, todos, { excludeExtraneousValues: true });
    } catch (error) {
      throw new InternalServerErrorException(
        error || 'An error occurred while fetching the todos',
      );
    }
  }

  async update(id: number, updateTodoPayload: UpdateTodoDto): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      if (updateTodoPayload.updatedUserId) {
        const updatedUser = await this.userRepository.findOne({
          where: { id: updateTodoPayload.updatedUserId },
        });

        if (!updatedUser) {
          throw new NotFoundException(
            `User with ID ${updateTodoPayload.updatedUserId} not found`,
          );
        }

        todo.userId = updateTodoPayload.updatedUserId;
        todo.user = updatedUser;
      }

      if (updateTodoPayload.title) {
        todo.title = updateTodoPayload.title;
      }

      if (updateTodoPayload.description) {
        todo.description = updateTodoPayload.description;
      }

      if (updateTodoPayload.state) {
        todo.state = updateTodoPayload.state;
      }

      const updatedTodo = await this.todoRepository.save(todo);

      const sanitizedTodo = plainToClass(Todo, updatedTodo, {
        excludeExtraneousValues: true,
      });

      return sanitizedTodo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while updating the todo',
      );
    }
  }
}
