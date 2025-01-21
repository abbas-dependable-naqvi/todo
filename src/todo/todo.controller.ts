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
import {
  CreateTodoPayloadDTO,
  UpdateTodoPayloadDTO,
  FindTodoQueryDTO,
} from './dto';
import { GetTodoRequest, UserPayload } from 'src/types/payload';
import { AuthGuard } from 'src/auth/auth.gaurd';

@UseGuards(AuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() createTodoPayload: CreateTodoPayloadDTO) {
    return this.todoService.create(createTodoPayload);
  }

  @Get(':id')
  find(@Param('id') id: string, @Request() req: GetTodoRequest) {
    const payload: UserPayload = req.auth;
    return this.todoService.find(+id, payload.id);
  }

  @Get()
  findAll(@Query() query: FindTodoQueryDTO) {
    return this.todoService.findAll(query);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTodoPayload: UpdateTodoPayloadDTO,
  ) {
    return this.todoService.update(+id, updateTodoPayload);
  }
}
