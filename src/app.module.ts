import path from 'path';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from 'nestjs-prisma';
import { I18nModule, QueryResolver } from 'nestjs-i18n';

import { HttpExceptionFilter } from '@Filter/gql-exceptions.filter';
import { HealthModule } from '@Module/health/health.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import config from '@/configs/config';
import { GraphqlConfig, NestConfig } from '@/configs/config.interface';
import { AppResolver } from '@/app.resolver';

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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('gql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {},
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: false,
          playground: true,
          context: (ctx) => ctx,
        };
      },
      inject: [ConfigService],
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
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
