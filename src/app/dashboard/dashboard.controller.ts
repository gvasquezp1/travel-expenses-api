import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetTravelExpenseDashboardDto } from './dto/get-travel-expense-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('travel-expenses')
  async getTravelExpenseDashboard(
    @Query() query: GetTravelExpenseDashboardDto,
  ) {
    return this.dashboardService.getTravelExpenseDashboard(query);
  }
}
