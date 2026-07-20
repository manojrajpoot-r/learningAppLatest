import { Service } from '@angular/core';
import { Injectable, signal } from '@angular/core';

@Service()

export class PermissionService {
  private permissions = signal<Set<string>>(this.loadPermissions());
  private loadPermissions(): Set<string> {
    const stored = localStorage.getItem('permissions');

    if (!stored || stored === 'undefined') {
      return new Set<string>();
    }

    try {
      return new Set<string>(JSON.parse(stored));
    } catch {
      return new Set<string>();
    }
  }

  setPermissions(permissions: string[]) {
    this.permissions.set(new Set(permissions));
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  has(permission: string): boolean {
    console.log('Permissions:', [...this.permissions()]);
    console.log('Checking:', permission);
    return this.permissions().has(permission);
  }

  hasAny(permissions: string[]): boolean {
    return permissions.some(p => this.permissions().has(p));
  }

  hasAll(permissions: string[]): boolean {
    return permissions.every(p => this.permissions().has(p));
  }
}

