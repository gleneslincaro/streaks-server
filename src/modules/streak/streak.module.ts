import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';

@Module({
  providers: [StreakService],
  controllers: [StreakController],
})
export class StreakModule {}
