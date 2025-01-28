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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserPayloadDTO, LoginUserPayloadDTO } from './dto';
import { AuthGuard } from './auth.gaurd';
import { UserAuthData } from 'src/types/payload';

export interface PayloadRequest {
  auth: UserAuthData;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: CreateUserPayloadDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or password to create user',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async signup(@Body() createUserDto: CreateUserPayloadDTO) {
    try {
      const { email, password } = createUserDto;
      return await this.authService.register(email, password);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while signing up the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiBody({ type: LoginUserPayloadDTO })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async login(@Body() loginUserDto: LoginUserPayloadDTO) {
    try {
      const { email, password } = loginUserDto;
      return await this.authService.login(email, password);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while loggin in the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile fetched successfully',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async getProfile(@Request() req: PayloadRequest) {
    try {
      const auth: UserAuthData = req.auth;
      return await this.authService.getMe(auth.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Some error occurred while fetching the user profile.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
