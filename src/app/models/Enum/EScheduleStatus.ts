export enum EScheduleStatus {
  Scheduled = 1,
  Canceled = 2,
  Completed = 3,
}

export const EScheduleStatusLabel: Record<EScheduleStatus, string> = {
  [EScheduleStatus.Scheduled]: 'Agendado',
  [EScheduleStatus.Canceled]: 'Cancelado',
  [EScheduleStatus.Completed]: 'Concluído',
};
