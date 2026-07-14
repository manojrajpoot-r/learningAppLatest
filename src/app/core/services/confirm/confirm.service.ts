import { Service, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;

}
@Service()
export class ConfirmService {
  visible = signal(false);
  options = signal<ConfirmOptions | null>(null);

  open(option: ConfirmOptions) {
    this.options.set(option);
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
    this.options.set(null);
  }

  confirm() {
    const option = this.options();

    if (option) {
      option.onConfirm();
    }

    this.close();
  }

}
