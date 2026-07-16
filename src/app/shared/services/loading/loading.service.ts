import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
  loading = signal(false);

  show() {
    this.loading.set(true);
  }

  hide() {
    this.loading.set(false);
  }
}
