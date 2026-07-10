import { Component, inject } from '@angular/core';
import { User } from '../../../core/models/user/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  private userService = inject(UserService);
  // users: User[] = [];

  //tosignal
  //users = toSignal(this.userService.getUsers());
  //resource
  users = resource({
    loader: async () => {
      const response = await firstValueFrom(this.userService.getUsers());
      return response.data;
    }
  });

  ngOnInit() {
    //this.loadUser();
  }


  // loadUser() {
  //   this.userService.getUsers().subscribe({
  //     next: (res) => {
  //       this.users = res.data;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     }
  //   })
  // }
}
