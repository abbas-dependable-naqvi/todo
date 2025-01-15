import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

export enum TodoState {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

@Entity('todo')
export class Todo {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  @Expose()
  title: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @Column({
    type: 'enum',
    enum: TodoState,
    default: TodoState.PENDING,
  })
  @Expose()
  state: TodoState;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Expose()
  userId: number;
}
