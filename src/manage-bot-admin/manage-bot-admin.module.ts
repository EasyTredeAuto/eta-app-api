import { Module } from '@nestjs/common';
import { ManageBotAdminService } from './manage-bot-admin.service';
import { ManageBotAdminController } from './manage-bot-admin.controller';

@Module({
  providers: [ManageBotAdminService],
  controllers: [ManageBotAdminController]
})
export class ManageBotAdminModule {}
