import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { apiPrefix, serverPort, serverPortString } from './const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(apiPrefix);

  const configService = app.get(ConfigService);
  const port = configService.get<number>(serverPortString) ?? serverPort;

  await app.listen(port);
}
bootstrap();
