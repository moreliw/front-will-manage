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
  [EScheduleStatus.Scheduled]: '#66b2ff',
  [EScheduleStatus.Canceled]: '#f08080',
  [EScheduleStatus.Completed]: '#85e085',
  [EScheduleStatus.InProgress]: '#ffe680',
  [EScheduleStatus.Confirmed]: '#5fd1e6',
  [EScheduleStatus.NoShow]: '#adb5bd',
  [EScheduleStatus.Rescheduled]: '#ffa868',
  [EScheduleStatus.WaitingRoom]: '#ff7fbf',
  [EScheduleStatus.FollowUp]: '#70757a',
};
