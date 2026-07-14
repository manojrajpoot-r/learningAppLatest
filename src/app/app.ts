import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './frontend/home/home';
import { Toast } from './shared/components/toast/toast';
import { ConfirmDialog } from './shared/components/confirm-dialog/confirm-dialog';
import { Loading } from './shared/components/loading/loading';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Toast, ConfirmDialog, Loading],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('learningAppLatest');


  email_data = signal('manoj@gmail.com');

  product_list = signal([
    { id: 1, name: 'leptop', price: 30000 },
    { id: 2, name: 'mobile', price: 20000 },
  ]);



  changeName() {
    this.email_data.set('rajni@gmail.com');
  }

  delete(id: number) {

    alert(id);

  }
}
