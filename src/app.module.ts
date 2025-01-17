import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
