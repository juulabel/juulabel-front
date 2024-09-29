export interface Alarm {
  id: number;
  type: string;
  image: string | null;
  createdAt: string;
  content: string;
  isRead: boolean;
}

export interface AlarmList {
  alarmList: Alarm[];
}
