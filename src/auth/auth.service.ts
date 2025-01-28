import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { tokenExpiryTimeString } from 'src/const';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    try {
      const existingUser = await this.authRepository.findUserByEmail(email);
      if (existingUser) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.authRepository.createUser(
        email,
        hashedPassword,
      );

      const token = this.jwtService.sign(
        { id: newUser.id, email: newUser.email },
        { expiresIn: tokenExpiryTimeString },
      );
      return {
        message: 'User created successfully',
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred during registration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    try {
      const user = await this.authRepository.findUserByEmail(email);
      if (!user) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Invalid email or password',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = this.jwtService.sign(
        { id: user.id, email: user.email },
        { expiresIn: tokenExpiryTimeString },
      );
      return {
        message: 'Login successful',
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'An error occurred during login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMe(
    userId: number,
  ): Promise<{ message: string; user: { id: number; email: string } }> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User profile',
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while fetching user details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
