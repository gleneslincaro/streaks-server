import { Module } from '@nestjs/common';
import { StreakModule } from './modules/streak/streak.module';

@Module({
  imports: [StreakModule],
})
export class AppModule {}
