import { Service, inject } from '@angular/core';

import { debounceTime } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { Subject, Subscription, fromEvent, merge } from 'rxjs';
@Service()
export class IdleService {

  private toast = inject(ToastService);

  private subscription?: Subscription;
  private timer: any;
  private timeout = 15 * 60 * 1000;
  private started = false;
  private timeoutSubject = new Subject<void>();
  timeout$ = this.timeoutSubject.asObservable();

  start() {
    if (this.started) {
      return;
    }
    this.started = true;
    this.resetTimer();
    this.subscription = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll')
    )
      .pipe(
        debounceTime(300)
      )
      .subscribe(() => {
        this.resetTimer();
      });
  }

  stop() {
    this.subscription?.unsubscribe();
    clearTimeout(this.timer);
    this.started = false;
  }

  private resetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.toast.warning('Session expired');
      this.timeoutSubject.next();
    }, this.timeout);

  }

}
