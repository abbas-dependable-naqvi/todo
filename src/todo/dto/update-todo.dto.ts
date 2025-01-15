import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { TodoState } from 'src/entities/todo.entity';

export class UpdateTodoDto {
  @IsString()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  title: string;

  @IsEnum(TodoState, {
    message:
      'State must be one of the following: pending, in_progress, completed',
  })
  @IsOptional()
  state: TodoState | null = TodoState.PENDING;

  @IsInt()
  @IsNotEmpty({ message: 'User ID must be a valid number' })
  userId: number;

  @IsInt()
  updatedUserId: number;

  @IsString()
  @IsOptional()
  description: string;
}
