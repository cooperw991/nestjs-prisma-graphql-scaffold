import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import config from '@/configs/config';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
