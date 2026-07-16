import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {

  loading = inject(LoadingService);
}
