export interface INotificationsAPIReponse {
  success: boolean;
  message: string;
  result: INotificationResult;
}

export interface INotificationResult {
  notificationSummaries: INotificationSummaries;
}

interface INotificationSummaries {
  first: boolean;
  last: boolean;
  size: number;
  content: INotificationSummary[];
  number: number;
  sort: ISortInfo;
  numberOfElements: number;
  pageable: IPageableObject;
  empty: boolean;
}

export interface INotificationSummary {
  id: number;
  relatedUrl: string;
  content: string;
  notificationType: string; // Eunm
  isRead: boolean;
  createdAt: string;
}

interface ISortInfo {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

interface IPageableObject {
  offset: number;
  sort: ISortInfo;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}
