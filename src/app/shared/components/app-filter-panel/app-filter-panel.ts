import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-panel',
  imports: [],
  templateUrl: './app-filter-panel.html',
  styleUrl: './app-filter-panel.css',
})
export class AppFilterPanel {
  visible = input(false);
  title = input('Filters');
  close = output<void>();
  apply = output<void>();
  reset = output<void>();
}