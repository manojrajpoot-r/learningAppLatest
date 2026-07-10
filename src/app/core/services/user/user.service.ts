import { Service } from '@angular/core';
import { BaseApiService } from '../base-api/base-api.service';
import { ApiResponse } from '../../models/api-response/ApiResponse.model';
import { User } from '../../models/user/user.model';
@Service()
export class UserService extends BaseApiService {

  getUsers() {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/User/list`);
  }
}
