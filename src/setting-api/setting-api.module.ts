import { CacheModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/schemas/user.entity';
import env from 'src/utils/env';
import { SettingApiController } from './setting-api.controller';
import { ApiSetting } from '../schemas/user-secret-api.entity';
import { SettingApiService } from './setting-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiSetting,
      User,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get(env.SECRET_KEY_BOT),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    CacheModule.register(),
  ],
  controllers: [SettingApiController],
  providers: [SettingApiService],
})
export class SettingApiModule {}
