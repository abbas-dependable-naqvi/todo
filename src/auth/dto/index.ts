import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserPayloadDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password must be at most 30 characters long' })
  @Matches(/^(?=(.*[A-Z]))(?=(.*[a-z]))(?=(.*\d))(?=(.*[@$!%*?&])).{8,30}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be between 8 to 30 characters long',
  })
  password: string;
}

export class LoginUserPayloadDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
