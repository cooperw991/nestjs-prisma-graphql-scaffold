import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import compression from 'compression';
import { PrismaService } from 'nestjs-prisma';

import { AppModule } from '@/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestConfig, SwaggerConfig } from '@/configs/config.interface';
import { loggerConfig } from '@/logger/logger.config';
import { loggingMiddleware } from '@Middleware/logging.middleware';
import { softDeleteMiddleware } from '@Middleware/soft-delete.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.$use(loggingMiddleware);
  prismaService.$use(softDeleteMiddleware);

  if (process.env.NODE_ENV !== 'production') {
    const swaggerConfig = configService.get<SwaggerConfig>('swagger');
    const swaggerConf = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConf);
    SwaggerModule.setup('restAPI', app, document);
  }

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'production' ? true : false,
    }),
  );
  app.use(compression());

  await app.listen(nestConfig.port, '0.0.0.0', () => {
    Logger.log(`Api server started on: http://localhost:${nestConfig.port}`);
  });
}
bootstrap();
