import { Customer } from './customer';
import { Procedure } from './procedure';
import { Responsible } from './responsible';

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
  duration: string;
  procedures: Procedure[];
  responsible: Responsible;
}
