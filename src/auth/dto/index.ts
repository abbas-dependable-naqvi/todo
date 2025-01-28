import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserPayloadDTO {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description:
      'Password for the user. Must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 30,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  @Matches(/^(?=(.*[A-Z]))(?=(.*[a-z]))(?=(.*\d))(?=(.*[@$!%*?&])).{8,30}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be between 8 to 30 characters long',
  })
  password: string;
}

export class LoginUserPayloadDTO {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'P@ssw0rd123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
