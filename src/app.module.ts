import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import env from './utils/env';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cs: ConfigService) => ({
        type: "mysql",
        host: cs.get(env.MYSQL_DB_HOST),
        port: cs.get(env.MYSQL_DB_PORT),
        username: cs.get(env.MYSQL_DB_USER),
        password: cs.get(env.MYSQL_DB_PASSWORD),
        database: cs.get(env.MYSQL_DB_NAME),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
