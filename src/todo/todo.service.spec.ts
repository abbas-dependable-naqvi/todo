import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo, TodoState } from './../entities/todo.entity';
import { User } from './../entities/user.entity';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateTodoDto } from './dto/create-todo.dto';

describe('TodoService', () => {
  let service: TodoService;
  let todoRepository: Repository<Todo>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(todoRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('find', () => {
    it('should return a todo if it exists and belongs to the user', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Description of the test todo',
        state: 'pending',
        userId: 1,
      };

      (todoRepository.findOne as jest.Mock).mockResolvedValue(mockTodo);

      const userID = 1;
      const todoID = 1;

      const result = await service.find(todoID, userID);

      const sanitizedTodo = plainToClass(Todo, mockTodo, {
        excludeExtraneousValues: true,
      });
      expect(result).toEqual(sanitizedTodo);

      expect(todoRepository.findOne).toHaveBeenCalledWith({
        where: { id: todoID },
      });
    });

    it('should throw NotFoundException if the todo is not found', async () => {
      const todoID = 1;
      const userID = 1;

      (todoRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.find(todoID, userID)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if the user does not own the todo', async () => {
      const mockTodo = {
        id: 1,
        title: 'Test Todo',
        description: 'Description of todo',
        state: 'pending',
        userId: 2,
      };

      const todoID = 1;
      const userID = 1;

      (todoRepository.findOne as jest.Mock).mockResolvedValue(mockTodo);

      await expect(service.find(todoID, userID)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.find(todoID, userID)).rejects.toThrow(
        `You don't have access to this todo`,
      );
    });
  });

  describe('create', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      password: 'password123',
      todos: [],
    };

    const mockCreateTodoPayload: CreateTodoDto = {
      title: 'test todo',
      state: TodoState.PENDING,
      userId: 1,
      description: 'test description',
    };

    const unsanitizedTodo: Todo = {
      id: 1,
      title: 'test todo',
      state: TodoState.PENDING,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      description: 'test description',
      user: mockUser,
    };

    const mockTodo = {
      title: 'test todo',
      description: 'test description',
      state: TodoState.PENDING,
      userId: 1,
      user: mockUser,
    };

    const mockSanitizedTodo = plainToClass(Todo, unsanitizedTodo, {
      excludeExtraneousValues: true,
    });

    it('should throw NotFoundException if the user is not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.create(mockCreateTodoPayload)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw internal server error when saving', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      (todoRepository.save as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.create(mockCreateTodoPayload)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.create(mockCreateTodoPayload)).rejects.toThrow(
        'An error occurred while saving the todo',
      );
    });

    it('successfully create the todo', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      (todoRepository.save as jest.Mock).mockResolvedValue(unsanitizedTodo);
      (todoRepository.create as jest.Mock).mockResolvedValue(mockTodo);

      const result = await service.create(mockCreateTodoPayload);

      expect(result).toEqual(mockSanitizedTodo);
    });
  });
});
