import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { TodoState } from 'src/entities';

export class CreateTodoPayloadDTO {
  @IsString()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(128, { message: 'Title must be at max 128 character long' })
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

  @IsString()
  @IsOptional()
  @MaxLength(128, { message: 'Description must be at max 1028 character long' })
  description: string;
}

export class UpdateTodoPayloadDTO extends CreateTodoPayloadDTO {
  @IsInt()
  updatedUserId: number;
}

export class FindTodoQueryDTO {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsEnum(TodoState)
  state?: TodoState;

  @IsOptional()
  @IsString()
  title?: string;
}
