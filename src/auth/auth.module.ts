import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtSecretKey, tokenExpiryTimeString } from 'src/const';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, Todo } from 'src/entities';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Todo]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>(jwtSecretKey),
        signOptions: { expiresIn: tokenExpiryTimeString },
      }),
    }),
  ],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
})
export class AuthModule {}
