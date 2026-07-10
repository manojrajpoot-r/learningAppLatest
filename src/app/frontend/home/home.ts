import { Component } from '@angular/core';
import { signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { NgStyle } from '@angular/common';
import { input } from '@angular/core';
import { output } from '@angular/core';
@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  title = signal("Angular 22 learning");
  trainer = signal('Manoj Rajpoot');
  experince = signal(4);
  salary = signal(25000);

  imageUrl = signal('https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif');
  placeHolder = signal('Enter your name');
  isDisabled = signal(false);
  boxWidth = signal(10);
  website = signal('https://angular.dev');
  isChecked = signal(true);
  username = signal('Manoj Rajpoot');
  buttonClass = signal('btn-success');
  textColor = signal('blue');
  fontSize = signal(30);
  background = signal('orange');
  //signal
  counter = signal(0);
  status = signal('');
  name = "Arti rajpoot";
  mob = signal('7388266728');
  isLogin = signal(false);
  role = signal('admin');
  isdark = signal(false);
  isActive = signal(true);
  stock = signal(5);

  email = input('');
  productChildData = input<any[]>();

  deleteUser = output<number>();

  message = signal('Manoj Rajpoot Happy')
  internal = new Date();


  users = signal(['manoj', 'sunil', 'prince', 'virat', 'rahul']);
  products = signal([
    { id: 1, name: 'manoj', city: 'noida' },
    { id: 2, name: 'virat', city: 'lundon' },
    { id: 3, name: 'rahul', city: 'mumbai' },
    { id: 4, name: 'dhvan', city: 'austriliya' }
  ]);

  constructor() {
    //this.buttonClass.set('btn-danger');
    //this.background.set('green');

    effect(() => {
      this.status.set(`Count changed to ${this.counter()}`);
    })
  }

  increment() {
    this.counter.update(v => v + 1);
  }

  decrement() {
    if (this.counter() > 0) {
      this.counter.update(v => v - 1);
    }

  }

  reset() {
    this.counter.set(0);
  }

  total = computed(() => this.counter() * 2);



  //themes
  // changeTheme() {
  //   this.isdark.update(v => !v);
  // }
  //   toggleStatus() {
  //   this.isActive.update(v => !v);
  // }
  //login
  isLogginIn() {
    this.isLogin.update(v => !v);
  }

  delete() {

    this.deleteUser.emit(5);

  }

}
