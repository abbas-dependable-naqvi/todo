// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Todo } from './entities/todo.entity';
import { User } from './entities/user.entity';
import { AuthModule } from './auth/auth.module';
import {
  dbHostString,
  dbNameString,
  dbPasswordString,
  dbPortString,
  dbType,
  dbUsernameString,
} from './const';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: dbType,
        host: configService.get<string>(dbHostString),
        port: configService.get<number>(dbPortString),
        username: configService.get<string>(dbUsernameString),
        password: configService.get<string>(dbPasswordString),
        database: configService.get<string>(dbNameString),
        entities: [__dirname + '/entities/*.ts'],
        migrations: [__dirname + '/migrations/*.ts'],
        synchronize: false,
        logging: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Todo, User]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
