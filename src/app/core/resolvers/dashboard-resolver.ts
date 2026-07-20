import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { map } from 'rxjs';
import { DashboardDto } from '../models/dashboard/dashboardDto.model';
export const dashboardResolver: ResolveFn<DashboardDto> = () => {
  return inject(DashboardService)
    .getDashboard()
    .pipe(
      map(response => response.data)
    );
};
