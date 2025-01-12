import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    console.log('1');
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    console.log('2 ', existingUser);
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    console.log('3 ', newUser);
    await this.userRepository.save(newUser);

    const token = this.jwtService.sign(
      { id: newUser.id, email: newUser.email },
      { expiresIn: '1h' },
    );
    console.log('4 ', token);
    return {
      message: 'User created successfully',
      token,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { expiresIn: '1h' },
    );
    return {
      message: 'Login successful',
      token,
    };
  }
}
