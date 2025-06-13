import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
// Import only ONE landing page plugin
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { LevelsModule } from './levels/levels.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsModule } from './contents/contents.module';
import { ActivitiesModule } from './activities/activities.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { formatError } from './graphql/format-errors';
import { LenguagesModule } from './lenguages/lenguages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '../.env.production'
          : '../.env.development',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
      playground: false, // Disable the default playground
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req, res }) => ({ req, res }),
      formatError,
      csrfPrevention: false,
      cache: 'bounded',
      debug: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
        numberScalarMode: 'float',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    LevelsModule,
    ContentsModule,
    ActivitiesModule,
    HomeworksModule,
    UsersModule,
    AuthModule,
    LenguagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
