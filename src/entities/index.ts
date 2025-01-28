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

export enum TodoState {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}

@Entity('user')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false, length: 128 })
  email: string;

  @Column({ nullable: false, length: 32 })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user, { cascade: true })
  todos: Todo[];
}

@Entity('todo')
export class Todo extends BaseEntity {
  @Column({ nullable: false, length: 256 })
  title: string;

  @Column({ nullable: true, length: 512 })
  description: string;

  @Column({
    type: 'enum',
    enum: TodoState,
    default: TodoState.PENDING,
    nullable: false,
  })
  state: TodoState;

  @ManyToOne(() => User, (user) => user.todos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  userId: number;
}

export class TodoResponseDTO {
  id: number;
  title: string;
  description: string | null;
  state: TodoState;
  userId: number;

  constructor(todo: Todo) {
    this.id = todo.id;
    this.title = todo.title;
    this.description = todo.description;
    this.state = todo.state;
    this.userId = todo.userId;
  }
}
