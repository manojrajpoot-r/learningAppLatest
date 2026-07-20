 import { Component, input } from '@angular/core';

@Component({
  selector: 'app-app-stats-card',
  imports: [],
  templateUrl: './app-stats-card.html',
  styleUrl: './app-stats-card.css',
})
export class AppStatsCard {
 
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input('');
  icon = input('');
  color = input('primary');
  loading = input(false);

}
