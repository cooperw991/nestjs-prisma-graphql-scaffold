import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { Logger } from '@nestjs/common';

import { NestConfig } from '@/configs/config.interface';
import { loggerConfig } from '@/logger/logger.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  await app.listen(nestConfig.port, '0.0.0.0', () => {
    Logger.log(`Api server started on: http://localhost:${nestConfig.port}`);
  });
}
bootstrap();
