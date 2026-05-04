export type DataScope = 'VIEW_ALL' | 'APPROVER_USERS' | 'OWN_ONLY';

export interface AmountCount {
  amount: number;
  count: number;
}

export interface MonthlyRequests extends AmountCount {
  month: number;
  year: number;
}

export interface ByStatus {
  statusId: string;
  statusName: string;
  totalAmount: number;
  totalCount: number;
}

export interface ByCategory {
  categoryName: string;
  totalAmount: number;
  totalCount: number;
}

export interface WeeklyTrend {
  week: number;
  label: string;
  totalAmount: number;
  totalCount: number;
}

export interface ByUser {
  requestedForUserId: string;
  requestedForUserName: string;
  totalAmount: number;
  totalCount: number;
}

export interface DashboardFilters {
  userId: string;
  month: number;
  year: number;
  scope: DataScope;
}

export interface TravelExpenseDashboardResponse {
  summary: {
    totalRequests: AmountCount;
    monthlyRequests: MonthlyRequests;
    monthlyAverage: AmountCount;
    pendingRequests: AmountCount;
    legalizedRequests: AmountCount;
  };
  byStatus: ByStatus[];
  byCategory: ByCategory[];
  weeklyTrend: WeeklyTrend[];
  byUser: ByUser[];
  filters: DashboardFilters;
}
