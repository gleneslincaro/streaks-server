import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
const RECOVERY_DAYS_THRESHOLD = 3;
export enum StreakState {
  COMPLETED = 'COMPLETED',
  AT_RISK = 'AT_RISK',
  SAVED = 'SAVED',
  INCOMPLETE = 'INCOMPLETE',
}

interface Day {
  date: string;
  activities: number;
  state:
    | StreakState.COMPLETED
    | StreakState.AT_RISK
    | StreakState.SAVED
    | StreakState.INCOMPLETE;
}

export interface StreakResponse {
  activitiesToday: number;
  total: number;
  days: Day[];
}

@Injectable()
export class StreakService {
  private currentDate: string = moment().format('YYYY-MM-DD');

  private loadActivityDataMockup(caseId: number): StreakResponse {
    let streakData;
    switch (caseId) {
      case 1:
        streakData = {
          activitiesToday: 3,
          days: [
            {
              date: moment(this.currentDate)
                .subtract(3, 'days')
                .format('YYYY-MM-DD'),
              activities: 1,
            },
            {
              date: moment(this.currentDate)
                .subtract(2, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            {
              date: moment(this.currentDate)
                .subtract(1, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            { date: this.currentDate, activities: 3 },
          ],
        };
        break;
      case 2:
        streakData = {
          activitiesToday: 1,
          days: [
            {
              date: moment(this.currentDate)
                .subtract(4, 'days')
                .format('YYYY-MM-DD'),
              activities: 1,
            },
            {
              date: moment(this.currentDate)
                .subtract(3, 'days')
                .format('YYYY-MM-DD'),
              activities: 1,
            },
            {
              date: moment(this.currentDate)
                .subtract(2, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            {
              date: moment(this.currentDate)
                .subtract(1, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            { date: this.currentDate, activities: 1 },
          ],
        };
        break;
      case 3:
        streakData = {
          activitiesToday: 3,
          days: [
            {
              date: moment(this.currentDate)
                .subtract(4, 'days')
                .format('YYYY-MM-DD'),
              activities: 1,
            },
            {
              date: moment(this.currentDate)
                .subtract(3, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            {
              date: moment(this.currentDate)
                .subtract(2, 'days')
                .format('YYYY-MM-DD'),
              activities: 0,
            },
            {
              date: moment(this.currentDate)
                .subtract(1, 'days')
                .format('YYYY-MM-DD'),
              activities: 2,
            },
            { date: this.currentDate, activities: 0 },
          ],
        };
        break;
      default:
        throw new Error('Invalid case ID');
    }
    return streakData;
  }

  getStreakData(caseId: number): StreakResponse {
    const streakData = this.loadActivityDataMockup(caseId);
    let activitiesToday = 0;
    let recoveryDays = 0;
    let previousState = StreakState.INCOMPLETE;
    const dateToday = moment().format('YYYY-MM-DD');
    streakData.days.forEach((day, index) => {
      const { activities } = day;

      day.state = StreakState.INCOMPLETE;
      if (day.date === moment().format('YYYY-MM-DD')) {
        activitiesToday = activities;
      }
      // If there are activities, try to mark the day as COMPLETED or SAVED
      if (activities > 0) {
        if (
          previousState === StreakState.COMPLETED ||
          activities > recoveryDays
        ) {
          day.state = StreakState.COMPLETED;
          // Save all active recovery days
          for (let i = 1; i <= recoveryDays; i++) {
            if (streakData.days[index - i]) {
              streakData.days[index - i].state = StreakState.SAVED;
            }
          }

          recoveryDays = 0; // Reset recovery days after completing a day
        }
      }

      if (activities === 0 && day.date < dateToday) {
        recoveryDays++; // Increment recovery days after a completed streak
        if (recoveryDays >= RECOVERY_DAYS_THRESHOLD) {
          // loop for setting incomplete state for previous recovery days
          for (let i = 1; i <= recoveryDays; i++) {
            if (streakData.days[index - i]) {
              streakData.days[index - i].state = StreakState.INCOMPLETE;
            }
          }
        } else {
          day.state = StreakState.AT_RISK;
        }
      }
      if (activities > 0 && recoveryDays > 0 && activities <= recoveryDays) {
        // loop for setting incomplete state for previous recovery days
        // Save some at risk days if current day has more than 1 activity
        for (let i = 1; i <= activities; i++) {
          if (
            streakData.days[index - i] &&
            streakData.days[index - i].state === StreakState.AT_RISK
          ) {
            streakData.days[index - i].state = StreakState.SAVED;
          }
        }
      }
      // After processing the current day, update previousState for next iteration
      previousState = day.state;
    });

    // Fill up the 7 days window with future dates if the current streak is less than 7
    const daysToAdd = 7 - streakData.days.length;
    for (let i = 1; i <= daysToAdd; i++) {
      streakData.days.push({
        date: moment(this.currentDate).add(i, 'days').format('YYYY-MM-DD'),
        activities: 0,
        state: StreakState.INCOMPLETE,
      });
    }

    // Returning the streak data
    const streakCount = streakData.days.reduce((count, day) => {
      if (day.date <= dateToday) {
        if (
          day.state === StreakState.SAVED ||
          day.state === StreakState.COMPLETED
        ) {
          return count + 1;
        }
        if (day.date === dateToday) {
          return count;
        }
        return (count = 0);
      }
      return count;
    }, 0);

    return {
      total: streakCount,
      days: streakData.days.sort((a, b) => moment(a.date).diff(moment(b.date))),
      activitiesToday,
    };
  }
}
