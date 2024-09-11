export enum EScheduleStatus {
  Scheduled = 1,
  Canceled = 2,
  Completed = 3,
  InProgress = 4,
  Confirmed = 5,
  NoShow = 6,
  Rescheduled = 7,
  WaitingRoom = 8,
  FollowUp = 9,
}

export const EScheduleStatusLabel: Record<EScheduleStatus, string> = {
  [EScheduleStatus.Scheduled]: 'Agendado',
  [EScheduleStatus.Canceled]: 'Cancelado',
  [EScheduleStatus.Completed]: 'Concluído',
  [EScheduleStatus.InProgress]: 'Em andamento',
  [EScheduleStatus.Confirmed]: 'Confirmado',
  [EScheduleStatus.NoShow]: 'Não compareceu',
  [EScheduleStatus.Rescheduled]: 'Remarcado',
  [EScheduleStatus.WaitingRoom]: 'Na sala de espera',
  [EScheduleStatus.FollowUp]: 'Acompanhamento',
};

export const EScheduleStatusColors: Record<EScheduleStatus, string> = {
  [EScheduleStatus.Scheduled]: '#007bff',
  [EScheduleStatus.Canceled]: '#dc3545',
  [EScheduleStatus.Completed]: '#28a745',
  [EScheduleStatus.InProgress]: '#ffc107',
  [EScheduleStatus.Confirmed]: '#17a2b8',
  [EScheduleStatus.NoShow]: '#6c757d',
  [EScheduleStatus.Rescheduled]: '#fd7e14',
  [EScheduleStatus.WaitingRoom]: '#e83e8c',
  [EScheduleStatus.FollowUp]: '#343a40',
};
