import { Controller, Get, Param } from '@nestjs/common';
import { StreakService, StreakResponse } from './streak.service';

@Controller('streaks')
export class StreakController {
  constructor(private readonly streakService: StreakService) {}

  @Get(':case')
  getStreak(@Param('case') caseId: string): StreakResponse {
    return this.streakService.getStreakData(parseInt(caseId));
  }
}
