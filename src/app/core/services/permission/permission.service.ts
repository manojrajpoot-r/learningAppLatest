import { Service } from '@angular/core';
import { Injectable, signal } from '@angular/core';


@Service()

export class PermissionService {

  private permissions = signal(new Set<string>(JSON.stringify(localStorage.getItem('oermissions') ?? '[]')));

  setPermissions(permissions: string[]) {
    this.permissions.set(new Set(permissions));
    localStorage.setItem(
      'permissions',
      JSON.stringify(permissions)
    );

  }

  has(permission: string): boolean {
    return this.permissions().has(permission);
  }

  hasAny(permissions: string[]): boolean {
    return permissions.some(permission =>
      this.permissions().has(permission)
    );
  }

  hasAll(permissions: string[]): boolean {
    return permissions.every(permission =>
      this.permissions().has(permission)
    );
  }

}
