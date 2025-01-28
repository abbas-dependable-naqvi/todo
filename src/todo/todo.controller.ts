import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  CreateTodoPayloadDTO,
  UpdateTodoPayloadDTO,
  FindTodoQueryDTO,
} from './dto';
import { GetTodoRequest, UserAuthData } from 'src/types/payload';
import { AuthGuard } from 'src/auth/auth.gaurd';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(AuthGuard)
@ApiTags('Todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTodoPayloadDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Todo created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid create todo request body',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createTodoPayload: CreateTodoPayloadDTO) {
    try {
      return await this.todoService.create(createTodoPayload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while creating the todo.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateTodoPayloadDTO })
  @ApiResponse({
    status: 200,
    description: 'Return the todo with the given id',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid params',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async find(@Param('id') id: string, @Request() req: GetTodoRequest) {
    try {
      if (isNaN(+id)) {
        throw new HttpException(
          'Invalid ID qurey param. ID must be a valid number.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const auth: UserAuthData = req.auth;
      return await this.todoService.find(+id, auth.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while fetching the todo.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all todo with filters' })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'userId',
    description: 'Filter todos by user ID',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'state',
    description: 'Filter todos by state',
    required: false,
    enum: ['pending', 'in_progress', 'completed'],
  })
  @ApiQuery({
    name: 'title',
    description: 'Search todos by title',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all the todo with filters',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid params',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async findAll(@Query() query: FindTodoQueryDTO) {
    try {
      return await this.todoService.findAll(query);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while fetching all todos.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateTodoPayloadDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Todo updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid params',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async update(
    @Param('id') id: string,
    @Body() updateTodoPayload: UpdateTodoPayloadDTO,
  ) {
    try {
      if (isNaN(+id)) {
        throw new HttpException(
          'Invalid ID qurey param. ID must be a valid number.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.todoService.update(+id, updateTodoPayload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while updating the todo.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
