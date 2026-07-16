import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../services/confirm/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {

  confirm = inject(ConfirmService);
}
