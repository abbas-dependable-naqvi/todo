import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoState } from 'src/entities/todo.entity';
import { UserPayload } from 'src/types/payload';
import { AuthGuard } from 'src/auth/auth.gaurd';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createTodoPayload: CreateTodoDto) {
    return this.todoService.create(createTodoPayload);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  find(@Param('id') id: string, @Request() req: any) {
    const payload: UserPayload = req.payload;
    return this.todoService.find(+id, payload.id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('userId') userId?: number,
    @Query('state') state?: TodoState,
    @Query('title') title?: string,
  ) {
    return this.todoService.findAll({ userId, state, title });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoPayload: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoPayload);
  }
}
