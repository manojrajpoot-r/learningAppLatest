import { Service, inject } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { AuthService } from '../auth/auth.service';
@Service()


export class StorageService {
  private router = inject(Router);
  private auth = inject(AuthService);

  constructor() {
    fromEvent<StorageEvent>(
      window,
      'storage'
    ).subscribe(event => {
      this.onStorageChange(event);
    });
  }

  private onStorageChange(event: StorageEvent) {
    if (event.key !== 'accessToken') {
      return;
    }

    if (event.newValue == null) {
      this.auth.logout(false);
    }
  }
}
