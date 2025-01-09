// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async findByEmail(email: string): Promise<User | null> {
//     return this.userRepository.findOne({ where: { email } });
//   }

//   async create(user: Partial<User>): Promise<User> {
//     return this.userRepository.save(user);
//   }
// }
