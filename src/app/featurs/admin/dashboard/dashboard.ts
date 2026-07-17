import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  //currentUser: any = null;
  //signal
  currentUser = this.authService.currentUser;



  ngOnInit() {
    //   const user = this.authService.getCurrentUser();
    //   if (user) {
    //     this.currentUser = user;
    //   }
    //   console.log(this.currentUser);
    // }


  }


}
