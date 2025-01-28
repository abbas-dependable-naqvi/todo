import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  MinLength,
  IsNotEmpty,
  MaxLength,
  Min,
} from 'class-validator';
import { TodoState } from 'src/entities';

export class CreateTodoPayloadDTO {
  @ApiProperty({
    description: 'Title for the todo',
    example: 'Drink water',
    minLength: 1,
    maxLength: 128,
  })
  @IsString()
  @MinLength(1, { message: 'Title must be at least 1 character long' })
  @MaxLength(128, { message: 'Title must be at max 128 characters long' })
  title: string;

  @ApiPropertyOptional({
    description: 'State of the todo',
    enum: TodoState,
    example: TodoState.PENDING,
  })
  @IsEnum(TodoState, {
    message:
      'State must be one of the following: pending, in_progress, completed',
  })
  @IsOptional()
  state: TodoState | null = TodoState.PENDING;

  @ApiProperty({
    description: 'User ID associated with the todo',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsNotEmpty({ message: 'User ID must be a valid number' })
  @Min(1, { message: 'User ID must be a positive integer' })
  userId: number;

  @ApiPropertyOptional({
    description: 'Description for the todo',
    example: 'Remember to drink 8 glasses of water',
    maxLength: 128,
  })
  @IsString()
  @IsOptional()
  @MaxLength(1024, {
    message: 'Description must be at max 1024 characters long',
  })
  description: string;
}

export class UpdateTodoPayloadDTO extends CreateTodoPayloadDTO {
  @ApiProperty({
    description: 'User ID of the person whom todo is reassigned',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  updatedUserId: number;
}

export class FindTodoQueryDTO {
  @ApiPropertyOptional({
    description: 'Filter todos by user ID',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'User ID must be an integer' })
  @Min(1, { message: 'User ID must be a positive integer' })
  userId?: number;

  @ApiPropertyOptional({
    description: 'Filter todos by state',
    enum: TodoState,
    example: TodoState.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(TodoState, {
    message:
      'State must be one of the following: pending, in_progress, completed',
  })
  state?: TodoState;

  @ApiPropertyOptional({
    description: 'Search todos by title',
    example: 'Drink',
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title search parameter must be 1 character long' })
  title?: string;
}
