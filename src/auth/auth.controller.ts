import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.gaurd';
import { UserPayload } from 'src/types/payload';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      return await this.authService.register(email, password);
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      return await this.authService.login(email, password);
    } catch (error) {
      throw new HttpException(
        error.message || 'Invalid credentials',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getProfile(@Request() req: any) {
    const payload: UserPayload = req.payload;
    return {
      message: 'User profile',
      user: { id: payload.id, email: payload.email },
    };
  }
}
