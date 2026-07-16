import { Service } from '@angular/core';
import { BaseApiService } from '../base-api/base-api.service';
import { ApiResponse } from '../../models/api-response/ApiResponse.model';
import { User } from '../../models/user/user.model';
import { PaginationRequest } from '../../models/pagination-request/pagination-request';
import { CreateUserRequest } from '../../models/user/CreateUserRequest.model';
import { UpdateUserRequest } from '../../models/user/UpdateUserRequest.model';
import { HttpParams } from '@angular/common/http';
@Service()
export class UserService extends BaseApiService {

  getUsers(request: PaginationRequest) {
    return this.http.post<ApiResponse<User[]>>(
      `${this.apiUrl}/User/list`,
      request
    );
  }


  // getUsers(request: PaginationRequest) {

  //   let params = new HttpParams()
  //     .set('pageNumber', request.pageNumber)
  //     .set('pageSize', request.pageSize)
  //     .set('search', request.search ?? '');

  //   if (request.sortBy) {
  //     params = params.set('sortBy', request.sortBy);
  //   }

  //   if (request.sortOrder) {
  //     params = params.set('sortOrder', request.sortOrder);
  //   }

  //   return this.http.get<ApiResponse<User[]>>(
  //     this.apiUrl + '/Users',
  //     { params }
  //   );

  // }

  createUser(request: CreateUserRequest) {
    return this.http.post<ApiResponse<User>>(`${this.apiUrl}/User`, request);
  }

  getUserById(id: number) {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/User/${id}`);
  }

  updateUser(id: number, request: UpdateUserRequest) {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/User/${id}`, request)

  }
  toggleStatus(id: number) {
    return this.http.patch<ApiResponse<boolean>>(
      `${this.apiUrl}/User/status/${id}`,
      {}
    );
  }
  deleteUser(id: number) {
    return this.http.delete<ApiResponse<User>>(`${this.apiUrl}/User/${id}`);

  }
}
