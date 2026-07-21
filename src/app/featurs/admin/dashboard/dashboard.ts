import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardDto } from '../../../core/models/dashboard/dashboardDto.model';
import { AppStatsCard } from '../../../shared/components/app-stats-card/app-stats-card';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [AppStatsCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  route = inject(ActivatedRoute);
  dashboard = signal<DashboardDto | null>(null);

  ngOnInit() {
    this.dashboard.set(
      this.route.snapshot.data['dashboard']
    );
  }


}
