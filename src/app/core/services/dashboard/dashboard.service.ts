import { Service } from '@angular/core';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { DashboardResponse } from '../../models/dashboard/dashboardDto.model';
@Service()
export class DashboardService extends BaseApiService {
  getDashboard() {
    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/Dashboard`
    );
  }

}
