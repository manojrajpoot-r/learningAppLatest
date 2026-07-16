import { Service, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Service()
export class ToastService {

  toasts = signal<Toast[]>([]);
  private id = 0;

  show(message: string, type: Toast['type'], duration = 3000) {

    const toast: Toast = {
      id: ++this.id,
      type,
      message,
      duration
    };
    this.toasts.update(list => [...list, toast]);
    setTimeout(() => {
      this.remove(toast.id);

    }, duration)

  }

  remove(id: number) {
    this.toasts.update(list => list.filter(x => x.id !== id));

  }

  success(message: string) {
    this.show(message, 'success');
  }


  error(message: string) {
    this.show(message, 'error');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }
  info(message: string) {
    this.show(message, 'info');
  }
}
