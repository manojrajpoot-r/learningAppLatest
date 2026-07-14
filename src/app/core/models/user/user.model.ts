import { isActive } from "@angular/router";

export interface User {
  id: number;
  fullName: string;
  email: string;
  tenantId: number;
  isActive: boolean;
}
