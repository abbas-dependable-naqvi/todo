import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/entities';

@Injectable()
export class AuthRepository {
  private readonly userRepository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
  }

  async createUser(email: string, hashedPassword: string): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        email,
        password: hashedPassword,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(`Failed to fetch user by id: ${error.message}`);
    }
  }
}
