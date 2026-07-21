import { Component, input ,output} from '@angular/core';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './app-page-header.html',
  styleUrl: './app-page-header.css',
})
export class AppPageHeader {
  title = input.required<string>();
  subtitle = input('');
  icon = input('');
  showBack = input(false);
  showDivider = input(true);
  back = output<void>();
}
