import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';

export enum TodoState {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class BaseEntity {
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
}

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}

@Entity('todo')
export class Todo extends BaseEntity {
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
