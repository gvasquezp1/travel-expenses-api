import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TravelExpenseRequest } from '../travel-expense-request/entities/travel-expense-request.entity';
import { TravelExpenseRequestDetail } from '../travel-expense-request-detail/entities/travel-expense-request-detail.entity';
import { TravelExpenseRequestStatus } from '../travel-expense-request-status/entities/travel-expense-request-status.entity';
import { UserApprover } from '../user-approver/entities/user-approver.entity';
import { RolePermission } from '../permission/entities/role-permission.entity';
import { User } from '../users/entities/user.entity';
import { GetTravelExpenseDashboardDto } from './dto/get-travel-expense-dashboard.dto';
import {
  TravelExpenseDashboardResponse,
  DataScope,
  ByStatus,
  ByCategory,
  WeeklyTrend,
  ByUser,
} from './interfaces/travel-expense-dashboard-response.interface';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(TravelExpenseRequest)
    private readonly requestRepository: Repository<TravelExpenseRequest>,
    @InjectRepository(TravelExpenseRequestDetail)
    private readonly detailRepository: Repository<TravelExpenseRequestDetail>,
    @InjectRepository(TravelExpenseRequestStatus)
    private readonly statusRepository: Repository<TravelExpenseRequestStatus>,
    @InjectRepository(UserApprover)
    private readonly userApproverRepository: Repository<UserApprover>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getTravelExpenseDashboard(
    dto: GetTravelExpenseDashboardDto,
  ): Promise<TravelExpenseDashboardResponse> {
    const { userId } = dto;

    // Establecer mes y año actuales si no se proporcionan
    const today = new Date();
    const month = dto.month ?? today.getMonth() + 1;
    const year = dto.year ?? today.getFullYear();

    // Determinar el alcance de datos del usuario
    const scope = await this.determineUserScope(userId);

    // Obtener los IDs de las solicitudes visibles según el alcance
    const visibleRequestIds = await this.getVisibleRequestIds(userId, scope);

    // Si no hay solicitudes visibles, retornar respuesta vacía
    if (visibleRequestIds.length === 0) {
      return this.getEmptyDashboard(userId, month, year, scope);
    }

    // Calcular todos los indicadores
    const [
      totalRequests,
      monthlyRequests,
      monthlyAverage,
      pendingRequests,
      legalizedRequests,
      byStatus,
      byCategory,
      weeklyTrend,
      byUser,
    ] = await Promise.all([
      this.getTotalRequests(visibleRequestIds),
      this.getMonthlyRequests(visibleRequestIds, month, year),
      this.getMonthlyAverage(visibleRequestIds, month, year),
      this.getPendingRequests(visibleRequestIds),
      this.getLegalizedRequests(visibleRequestIds),
      this.getByStatus(visibleRequestIds),
      this.getByCategory(visibleRequestIds),
      this.getWeeklyTrend(visibleRequestIds, month, year),
      this.getByUser(visibleRequestIds),
    ]);

    return {
      summary: {
        totalRequests,
        monthlyRequests: { ...monthlyRequests, month, year },
        monthlyAverage,
        pendingRequests,
        legalizedRequests,
      },
      byStatus,
      byCategory,
      weeklyTrend,
      byUser,
      filters: {
        userId,
        month,
        year,
        scope,
      },
    };
  }

  private async determineUserScope(userId: string): Promise<DataScope> {
    // Verificar si el usuario tiene permiso global
    const hasViewAllPermission = await this.hasPermission(
      userId,
      'solicitud_viaticos.view_all',
    );

    if (hasViewAllPermission) {
      return 'VIEW_ALL';
    }

    // Verificar si el usuario tiene usuarios a cargo
    const managedUsers = await this.userApproverRepository.find({
      where: { approverUserId: userId },
    });

    if (managedUsers.length > 0) {
      return 'APPROVER_USERS';
    }

    return 'OWN_ONLY';
  }

  private async hasPermission(
    userId: string,
    permissionCode: string,
  ): Promise<boolean> {
    // Obtener el usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.roleId) {
      return false;
    }

    // Verificar si el rol tiene el permiso
    const rolePermission = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .innerJoin('permissions', 'p', 'p.id = rp.permissionId')
      .where('rp.roleId = :roleId', { roleId: user.roleId })
      .andWhere('p.code = :permissionCode', { permissionCode })
      .getOne();

    return !!rolePermission;
  }

  private async getVisibleRequestIds(
    userId: string,
    scope: DataScope,
  ): Promise<string[]> {
    const query = this.requestRepository
      .createQueryBuilder('request')
      .select('request.id')
      .where('request.locked IS DISTINCT FROM true');

    if (scope === 'VIEW_ALL') {
      // Ver todas las solicitudes no bloqueadas
    } else if (scope === 'APPROVER_USERS') {
      // Ver solo solicitudes de usuarios a cargo
      const managedUsers = await this.userApproverRepository.find({
        where: { approverUserId: userId },
      });
      const managedUserIds = managedUsers.map((mu) => mu.userId);

      if (managedUserIds.length === 0) {
        return [];
      }

      query.andWhere('request.requestedForUserId IN (:...managedUserIds)', {
        managedUserIds,
      });
    } else {
      // OWN_ONLY: ver solo propias solicitudes
      query.andWhere('request.requestedForUserId = :userId', { userId });
    }

    const results = await query.getMany();
    return results.map((r) => r.id);
  }

  private async getTotalRequests(visibleRequestIds: string[]) {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('COALESCE(SUM(request.amount), 0)', 'amount')
      .addSelect('COUNT(request.id)', 'count')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .getRawOne();

    return {
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  private async getMonthlyRequests(
    visibleRequestIds: string[],
    month: number,
    year: number,
  ) {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('COALESCE(SUM(request.amount), 0)', 'amount')
      .addSelect('COUNT(request.id)', 'count')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .andWhere('EXTRACT(MONTH FROM request.createdAt) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM request.createdAt) = :year', { year })
      .getRawOne();

    return {
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  private async getMonthlyAverage(
    visibleRequestIds: string[],
    month: number,
    year: number,
  ) {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('COALESCE(AVG(request.amount), 0)', 'amount')
      .addSelect('COUNT(request.id)', 'count')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .andWhere('EXTRACT(MONTH FROM request.createdAt) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM request.createdAt) = :year', { year })
      .getRawOne();

    return {
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  private async getPendingRequests(visibleRequestIds: string[]) {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('COALESCE(SUM(request.amount), 0)', 'amount')
      .addSelect('COUNT(request.id)', 'count')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .andWhere(
        "(request.status ILIKE '%pendiente%' OR request.status = 'pending')",
      )
      .getRawOne();

    return {
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  private async getLegalizedRequests(visibleRequestIds: string[]) {
    const result = await this.requestRepository
      .createQueryBuilder('request')
      .select('COALESCE(SUM(request.amount), 0)', 'amount')
      .addSelect('COUNT(request.id)', 'count')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .andWhere(
        "(request.status ILIKE '%legalizado%' OR request.status = 'legalized')",
      )
      .getRawOne();

    return {
      amount: parseFloat(result.amount) || 0,
      count: parseInt(result.count) || 0,
    };
  }

  private async getByStatus(visibleRequestIds: string[]): Promise<ByStatus[]> {
    const results = await this.requestRepository
      .createQueryBuilder('request')
      .select('request.status', 'statusName')
      .addSelect('COALESCE(SUM(request.amount), 0)', 'totalAmount')
      .addSelect('COUNT(request.id)', 'totalCount')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .groupBy('request.status')
      .getRawMany();

    return results.map((r) => ({
      statusId: r.statusName || 'unknown',
      statusName: r.statusName || 'Desconocido',
      totalAmount: parseFloat(r.totalAmount) || 0,
      totalCount: parseInt(r.totalCount) || 0,
    }));
  }

  private async getByCategory(
    visibleRequestIds: string[],
  ): Promise<ByCategory[]> {
    const results = await this.detailRepository
      .createQueryBuilder('detail')
      .select('detail.categoryName', 'categoryName')
      .addSelect('COALESCE(SUM(detail.amountRequested), 0)', 'totalAmount')
      .addSelect('COUNT(detail.id)', 'totalCount')
      .where('detail.travelExpenseRequestId IN (:...visibleRequestIds)', {
        visibleRequestIds,
      })
      .groupBy('detail.categoryName')
      .getRawMany();

    return results.map((r) => ({
      categoryName: r.categoryName,
      totalAmount: parseFloat(r.totalAmount) || 0,
      totalCount: parseInt(r.totalCount) || 0,
    }));
  }

  private async getWeeklyTrend(
    visibleRequestIds: string[],
    month: number,
    year: number,
  ): Promise<WeeklyTrend[]> {
    const results = await this.requestRepository
      .createQueryBuilder('request')
      .select('CEIL(EXTRACT(DAY FROM request.createdAt) / 7.0)', 'week')
      .addSelect('COALESCE(SUM(request.amount), 0)', 'totalAmount')
      .addSelect('COUNT(request.id)', 'totalCount')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .andWhere('EXTRACT(MONTH FROM request.createdAt) = :month', { month })
      .andWhere('EXTRACT(YEAR FROM request.createdAt) = :year', { year })
      .groupBy('week')
      .orderBy('week', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      week: parseInt(r.week),
      label: `Semana ${r.week}`,
      totalAmount: parseFloat(r.totalAmount) || 0,
      totalCount: parseInt(r.totalCount) || 0,
    }));
  }

  private async getByUser(visibleRequestIds: string[]): Promise<ByUser[]> {
    const results = await this.requestRepository
      .createQueryBuilder('request')
      .select('request.requestedForUserId', 'requestedForUserId')
      .addSelect('request.requestedForUserName', 'requestedForUserName')
      .addSelect('COALESCE(SUM(request.amount), 0)', 'totalAmount')
      .addSelect('COUNT(request.id)', 'totalCount')
      .where('request.id IN (:...visibleRequestIds)', { visibleRequestIds })
      .groupBy('request.requestedForUserId')
      .addGroupBy('request.requestedForUserName')
      .getRawMany();

    return results.map((r) => ({
      requestedForUserId: r.requestedForUserId,
      requestedForUserName: r.requestedForUserName,
      totalAmount: parseFloat(r.totalAmount) || 0,
      totalCount: parseInt(r.totalCount) || 0,
    }));
  }

  private getEmptyDashboard(
    userId: string,
    month: number,
    year: number,
    scope: DataScope,
  ): TravelExpenseDashboardResponse {
    return {
      summary: {
        totalRequests: { amount: 0, count: 0 },
        monthlyRequests: { amount: 0, count: 0, month, year },
        monthlyAverage: { amount: 0, count: 0 },
        pendingRequests: { amount: 0, count: 0 },
        legalizedRequests: { amount: 0, count: 0 },
      },
      byStatus: [],
      byCategory: [],
      weeklyTrend: [],
      byUser: [],
      filters: {
        userId,
        month,
        year,
        scope,
      },
    };
  }
}
