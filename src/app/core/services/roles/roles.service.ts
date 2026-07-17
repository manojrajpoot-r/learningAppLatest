import { Service } from '@angular/core';
import { BaseApiService } from '../../../shared/services/base-api/base-api.service';
import { ApiResponse } from '../../models/api-response/ApiResponse.model';
import { Role } from '../../models/role/role.model';
import { PaginationRequest } from '../../models/pagination-request/pagination-request';
@Service()
export class RolesService extends BaseApiService {


  getRoles(request: PaginationRequest) {
    return this.http.post<ApiResponse<Role[]>>(`${this.apiUrl}/Role/list`, request);
  }
}
