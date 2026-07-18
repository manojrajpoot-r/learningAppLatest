import { Service, signal, Injectable } from '@angular/core';

@Service()


export class LoadingService {
  private requestCount = 0;
  loading = signal(false);

  show() {
    this.requestCount++;
    this.loading.set(true);
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }

    if (this.requestCount === 0) {
      this.loading.set(false);
    }

  }

}
