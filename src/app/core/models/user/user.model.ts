import { isActive } from "@angular/router";

export interface User {
  id: number;
  fullname: string;
  email: string;
  tenantId: number;
  isActive: boolean;
}
