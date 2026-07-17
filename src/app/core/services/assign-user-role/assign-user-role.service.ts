import { Service } from '@angular/core';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { AssignRoleRequest } from '../../models/assign-role-request/assign-role-request.model';
import { ApiResponse } from '../../models/api-response/ApiResponse.model';

@Service()
export class AssignUserRoleService extends BaseApiService {

  assignRole(request: AssignRoleRequest) {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/AssignUserRole/assign-role`, request);
  }
  getUserRoles(userId: number) {
    return this.http.get<ApiResponse<number[]>>(`${this.apiUrl}/AssignUserRole/user-roles/${userId}`);
  }
}
