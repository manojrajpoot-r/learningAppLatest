
import { Directive, TemplateRef, ViewContainerRef, signal, inject, input, effect } from '@angular/core';
import { PermissionService } from '../services/permission/permission.service';
@Directive({
  selector: '[appHasPermission]',
})
export class HasPermission {
  private hasView = false;
  permission = input.required<string>({
    alias: 'appHasPermission'
  });
  templateRef = inject(TemplateRef<unknown>);
  viewContainer = inject(ViewContainerRef);
  permissionService = inject(PermissionService);



  constructor() {
    effect(() => {
      const allowed = this.permissionService.has(this.permission());
      if (allowed && !this.hasView) {
        this.viewContainer.createEmbeddedView(
          this.templateRef
        );
        this.hasView = true;
      }

      else if (!allowed && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
