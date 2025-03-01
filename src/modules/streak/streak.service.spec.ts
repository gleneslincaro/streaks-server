import { Test, TestingModule } from '@nestjs/testing';
import { StreakService, StreakState } from './streak.service';
import * as moment from 'moment';

describe('StreakService', () => {
  let service: StreakService;
  const dateFormat = 'YYYY-MM-DD';
  const currentDate = moment().format(dateFormat);
  const addDays = (days: number) =>
    moment(currentDate).add(days, 'days').format(dateFormat);
  const subtractDays = (days: number) =>
    moment(currentDate).subtract(days, 'days').format(dateFormat);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreakService],
    }).compile();

    service = module.get<StreakService>(StreakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate streak for case 1 - 3 day recovery success', () => {
    const streakData = [
      { date: addDays(3), activities: 0, state: StreakState.INCOMPLETE },
      { date: addDays(2), activities: 0, state: StreakState.INCOMPLETE },
      { date: addDays(1), activities: 0, state: StreakState.INCOMPLETE },
      { date: currentDate, activities: 3, state: StreakState.COMPLETED },
      { date: subtractDays(1), activities: 0, state: StreakState.SAVED },
      { date: subtractDays(2), activities: 0, state: StreakState.SAVED },
      { date: subtractDays(3), activities: 1, state: StreakState.COMPLETED },
    ];
    const expectedResult = { total: 4, days: streakData.sort((a, b) => moment(a.date).diff(moment(b.date))), activitiesToday: 3 };
    expect(service.getStreakData(1)).toEqual(expectedResult);
  });

  it('should calculate streak for case 2 - 3 day recovery ongoing', () => {
    const streakData = [
      { date: addDays(2), activities: 0, state: StreakState.INCOMPLETE },
      { date: addDays(1), activities: 0, state: StreakState.INCOMPLETE },
      { date: currentDate, activities: 1, state: StreakState.INCOMPLETE },
      { date: subtractDays(1), activities: 0, state: StreakState.AT_RISK },
      { date: subtractDays(2), activities: 0, state: StreakState.AT_RISK },
      { date: subtractDays(3), activities: 1, state: StreakState.COMPLETED },
      { date: subtractDays(4), activities: 1, state: StreakState.COMPLETED },
    ];
    const expectedResult = { total: 2, days: streakData.sort((a, b) => moment(a.date).diff(moment(b.date))), activitiesToday: 1 };
    expect(service.getStreakData(2)).toEqual(expectedResult);
  });

  it('should calculate streak for case 3 - 3 day recovery fail', () => {
    const streakData = [
      { date: addDays(2), activities: 0, state: StreakState.INCOMPLETE },
      { date: addDays(1), activities: 0, state: StreakState.INCOMPLETE },
      { date: currentDate, activities: 0, state: StreakState.INCOMPLETE },
      { date: subtractDays(1), activities: 2, state: StreakState.INCOMPLETE },
      { date: subtractDays(2), activities: 0, state: StreakState.SAVED },
      { date: subtractDays(3), activities: 0, state: StreakState.AT_RISK },
      { date: subtractDays(4), activities: 1, state: StreakState.COMPLETED },
    ];
    const expectedResult = { total: 2, days: streakData.sort((a, b) => moment(a.date).diff(moment(b.date))), activitiesToday: 0 };
    expect(service.getStreakData(3)).toEqual(expectedResult);
  });

  it('should throw an error for invalid case ID', () => {
    expect(() => service.getStreakData(999)).toThrow('Invalid case ID');
  });
});
