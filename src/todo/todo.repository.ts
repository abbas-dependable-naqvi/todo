import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Todo, TodoState } from 'src/entities';

@Injectable()
export class TodoRepository {
  private repository: Repository<Todo>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Todo);
  }

  async findById(id: number): Promise<Todo | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while accessing the database: ${error.message}`,
      );
    }
  }

  async findAll(filters: {
    userId?: number;
    state?: TodoState;
    title?: string;
  }): Promise<Todo[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('todo');

      if (filters.userId) {
        queryBuilder.andWhere('todo.userId = :userId', {
          userId: filters.userId,
        });
      }

      if (filters.state) {
        queryBuilder.andWhere('todo.state = :state', { state: filters.state });
      }

      if (filters.title) {
        queryBuilder.andWhere('todo.title LIKE :title', {
          title: `%${filters.title}%`,
        });
      }

      return await queryBuilder.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while accessing the database: ${error.message}`,
      );
    }
  }

  async save(todo: Todo): Promise<Todo> {
    try {
      return await this.repository.save(todo);
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred while saving to the database: ${error.message}`,
      );
    }
  }
}
