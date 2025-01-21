import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, Todo } from './entities';
import { AuthModule } from './auth/auth.module';
import {
  dbHostString,
  dbNameString,
  dbPasswordString,
  dbPortString,
  dbType,
  dbUsernameString,
} from './const';
import { TodoModule } from './todo/todo.module';

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
        entities: [Todo, User],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Todo, User]),
    AuthModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
