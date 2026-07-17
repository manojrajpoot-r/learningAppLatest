import { HttpClient } from '@angular/common/http';
import { Service } from '@angular/core';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
@Service()
export class BaseApiService {

  protected http = inject(HttpClient);
  protected apiUrl = environment.apiUrl;
}
