import { Component ,contentChild,input,output,HostListener} from '@angular/core';
import { ContentChild } from '@angular/core';
import { ModalFooter } from './directives/modal-footer';
import { effect } from '@angular/core';
@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  visible = input.required<boolean>();
  title = input('');
  size=input<'sm' | 'md' | 'lg'|'xl'>('md');
  loading = input(false);
  saveText = input('Save');
  cancelText = input('Cancel');
  close = output<void>();
  save = output<void>();
  icon = input('');
  color = input<
  'primary'
  |'success'
  |'danger'
  |'warning'
  >('primary');

  closeOnEscape = input(true);
  closeOnBackdrop = input(true);
  footer = contentChild(ModalFooter);

  @HostListener('document:keydown.escape')
  onEscape() {
    if (!this.visible()) {
      return;
    }

  if (!this.closeOnEscape()) {
    return;
  }
    this.close.emit();
  }

  backdropClick() {
    if (!this.closeOnBackdrop()) {
        return;
    }
    this.close.emit();
  }

  constructor() {
    effect(() => {
        if (this.visible()) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';
        }
    });

}
}
