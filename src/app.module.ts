import path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { I18nModule, QueryResolver } from 'nestjs-i18n';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import config from '@/configs/config';
import { NestConfig } from '@/configs/config.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {},
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage:
          configService.get<NestConfig>('nest').fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      inject: [ConfigService],
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
