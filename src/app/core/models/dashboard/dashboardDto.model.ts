export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardDto;
}

export interface DashboardDto {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrderDto[];
}

export interface RecentOrderDto {
  id: number;
  customerName: string;
  amount: number;
}
