import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TodoState, Todo } from 'src/entities';
import { plainToClass } from 'class-transformer';
import { CreateTodoPayloadDTO, UpdateTodoPayloadDTO } from './dto';
import { TodoRepository } from './todo.repository';
import { AuthRepository } from 'src/auth/auth.repository';

@Injectable()
export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async create(createTodoPayload: CreateTodoPayloadDTO): Promise<Todo> {
    try {
      const user = await this.authRepository.findById(createTodoPayload.userId);

      if (!user) {
        throw new NotFoundException(
          `User with ID ${createTodoPayload.userId} not found`,
        );
      }

      const state = createTodoPayload.state ?? TodoState.PENDING;

      const todo = new Todo();
      todo.title = createTodoPayload.title;
      todo.description = createTodoPayload.description;
      todo.state = state;
      todo.userId = createTodoPayload.userId;

      const savedTodo = await this.todoRepository.save(todo);

      return plainToClass(Todo, savedTodo, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while saving the todo',
      );
    }
  }

  async find(todoID: number, userID: number): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findById(todoID);

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${todoID} not found`);
      }

      if (todo.userId !== userID) {
        throw new UnauthorizedException("You don't have access to this todo");
      }

      return plainToClass(Todo, todo, { excludeExtraneousValues: true });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while fetching the todo',
      );
    }
  }

  async findAll(filters: {
    userId?: number;
    state?: TodoState;
    title?: string;
  }): Promise<Todo[]> {
    try {
      const todos = await this.todoRepository.findAll(filters);
      return plainToClass(Todo, todos, { excludeExtraneousValues: true });
    } catch (error) {
      throw new InternalServerErrorException(
        error || 'An error occurred while fetching the todos',
      );
    }
  }

  async update(
    id: number,
    updateTodoPayload: UpdateTodoPayloadDTO,
  ): Promise<Todo> {
    try {
      const todo = await this.todoRepository.findById(id);

      if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found`);
      }

      if (updateTodoPayload.updatedUserId) {
        const updatedUser = await this.authRepository.findById(
          updateTodoPayload.updatedUserId,
        );

        if (!updatedUser) {
          throw new NotFoundException(
            `User with ID ${updateTodoPayload.updatedUserId} not found`,
          );
        }

        todo.userId = updateTodoPayload.updatedUserId;
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

      return plainToClass(Todo, updatedTodo, { excludeExtraneousValues: true });
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
