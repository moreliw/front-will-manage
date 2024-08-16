import { Customer } from './customer';
import { Procedure } from './procedure';

export class ScheduleGrid {
  scheduleList: Schedule[];
  totalSchedulesDay: number;
  totalSchedulesWeek: number;
  totalSchedulesMonth: number;
}

export class Schedule {
  customerId: string;
  scheduleDate: string;
  id: string;
  status: string;
  phone: string;
  userId: string;
  customer: Customer;
  procedures: Procedure[];
}
