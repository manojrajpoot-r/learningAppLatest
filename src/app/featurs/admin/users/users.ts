import { Component, inject } from '@angular/core';
import { User } from '../../../core/models/user/user.model';
import { UserService } from '../../../core/services/user/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { resource, signal, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PaginationRequest } from '../../../core/models/pagination-request/pagination-request';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateUserRequest } from '../../../core/models/user/CreateUserRequest.model';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateUserRequest } from '../../../core/models/user/UpdateUserRequest.model';
import { RolesService } from '../../../core/services/roles/roles.service';
import { AssignUserRoleService } from '../../../core/services/assign-user-role/assign-user-role.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { ConfirmService } from '../../../shared/services/confirm/confirm.service';
import { Table, TableColumn, TableAction } from '../../../shared/components/table/table';
import { DatePipe } from '@angular/common';
import { ExportService } from '../../../shared/export/export.service';
import { MatCard } from '@angular/material/card';
import { MatCardHeader } from '@angular/material/card';
import { MatCardTitle } from '@angular/material/card';
@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, Table, DatePipe, MatCard, MatCardHeader, MatCardTitle],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {

  private userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private roleService = inject(RolesService);
  private assignUserRoleService = inject(AssignUserRoleService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmService)
  private exportService = inject(ExportService);
  visible = signal(false);
  isEditMode = signal(false);
  selectedEditId = signal<number | null>(null);
  searchText = signal('');
  showRoleModal = signal(false);
  selectedUserId = signal<number | null>(null);
  selectedRoles = signal<number[]>([]);

  columns: TableColumn<User>[] = [
    {
      field: 'fullName',
      header: 'Name',
      sortable: true
    },
    {
      field: 'email',
      header: 'Email',
      sortable: true
    },
    {
      field: 'isActive',
      header: 'Status',
      sortable: true,
      type: 'tag',
      tag: {
        activeText: 'Active',
        inactiveText: 'Inactive',
        activeClass: 'bg-success',
        inactiveClass: 'bg-danger'
      }
    }
  ];

  actions: TableAction<User>[] = [

    {
      action: 'edit',
      label: 'Edit',
      icon: 'bi bi-pencil',
      severity: 'info'
    },

    {
      action: 'delete',
      label: 'Delete',
      icon: 'bi bi-trash',
      severity: 'danger'
    },

    {
      action: 'toggleStatus',

      label: (row) => row.isActive ? 'Disable' : 'Enable',

      icon: (row) => row.isActive
        ? 'bi bi-lock-fill'
        : 'bi bi-unlock-fill',

      severity: (row) => row.isActive
        ? 'warning'
        : 'success'
    },

    {
      action: 'assignRole',
      label: 'Roles',
      icon: 'bi bi-people-fill',
      severity: 'primary'
    }

  ];



  handleAction(event: any) {
    switch (event.action) {
      case 'edit':
        this.openEditModal(event.row.id);
        break;

      case 'delete':
        this.handleDelete(event.row.id);
        break;
      case 'toggleStatus':
        this.toggleStatus(event.row);
        break;
      case 'assignRole':
        this.openAssignRoleModal(event.row.id);
        break;
    }
  }

  request = signal<PaginationRequest>({
    pageNumber: 1,
    pageSize: 10,
    search: '',
    sortBy: '',
    sortOrder: 'asc'
  });
  pageChange(page: number) {
    this.request.update(req => ({
      ...req,
      pageNumber: page
    }));

    this.users.reload();
  }
  handleSort(event: {
    field: string;
    order: 'asc' | 'desc';
  }) {

    this.request.update(req => ({
      ...req,
      sortBy: event.field,
      sortOrder: event.order,
      pageNumber: 1
    }));

    this.users.reload();

  }


  exportUsers() {
    const exportData = this.users.value()?.data.map(x => ({
      Name: x.fullName,
      Email: x.email,
      Status: x.isActive ? 'Active' : 'Inactive'
    })) ?? [];

    this.exportService.exportToExcel(
      exportData,
      'Users'
    );

  }

  users = resource({
    loader: async () => {
      return await firstValueFrom(
        this.userService.getUsers(this.request())
      );
    }
  });

  roles = resource({
    loader: async () => {
      return await firstValueFrom(
        this.roleService.getRoles({
          pageNumber: 1,
          pageSize: 1000,
          search: ''
        })
      );

    }
  });

  ngOnInit() {
    //this.loadUser();
  }


  handleForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],

  })

  openAddModal() {
    this.visible.set(true);
    this.isEditMode.set(false);
    this.selectedEditId.set(null);
    this.handleForm.reset();
    this.handleForm.get('password')?.setValidators([
      Validators.required, Validators.minLength(6)
    ]);
    this.handleForm.get('password')?.updateValueAndValidity();
  }
  openEditModal(id: number) {

    this.handleForm.get('password')?.clearValidators();
    this.handleForm.get('password')?.updateValueAndValidity();

    this.isEditMode.set(true);
    this.selectedEditId.set(id);
    this.userService.getUserById(id).subscribe({
      next: (res) => {
        this.handleForm.patchValue({
          fullName: res.data.fullName,
          email: res.data.email,
        }),
          this.visible.set(true);
      }
    })


    this.handleForm.reset();
    this.visible.set(true);
  }

  closeModal() {
    this.visible.set(false);
  }


  handleSave() {
    if (this.handleForm.invalid) {
      this.handleForm.markAllAsTouched();
      return;
    }
    const id = this.selectedEditId();
    if (id !== null) {
      const requestForm: UpdateUserRequest = {
        fullName: this.handleForm.value.fullName!,
        email: this.handleForm.value.email!
      };

      this.userService.updateUser(id, requestForm).subscribe({
        next: (res) => {
          this.toast.success(res.message ? res.message : "User Updated Successfully");
          this.visible.set(false);
          this.handleForm.reset();
          this.selectedEditId.set(null);
          this.isEditMode.set(false);
          this.users.reload();

        }
      });
    } else {

      const requestForm: CreateUserRequest = {
        fullName: this.handleForm.value.fullName!,
        email: this.handleForm.value.email!,
        password: this.handleForm.value.password!
      }



      this.userService.createUser(requestForm).subscribe({
        next: (res) => {
          this.toast.success(res.message ? res.message : "User Created Successfully");
          this.users.reload();
          this.handleForm.reset();
          this.visible.set(false);
        },
        error(err) {
          console.log(err);

        }
      })
    }

  }

  handleDelete(id: number) {
    this.confirm.open({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user?',
      onConfirm: () => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.toast.success("User deleted successfully");
            this.users.reload();
          },
          error: () => {
            this.toast.error("Something went wrong");
          }
        });
      }
    });
  }

  toggleStatus(user: User) {
    this.userService.toggleStatus(user.id).subscribe({
      next: (res) => {
        this.toast.success("Status update successfully!");
        this.users.reload();
      },
      error: () => {
        this.toast.error("Something went wrong");
      }
    });

  }

  //search
  constructor() {
    effect((onCleanup) => {
      const search_value = this.searchText();
      const timer = setTimeout(() => {
        this.request.update(req => ({
          ...req,
          search: search_value,
          pageNumber: 1
        }));
        this.users.reload();
      }, 500);
      onCleanup(() => clearTimeout(timer));
    })
  }

  openAssignRoleModal(userId: number) {
    this.selectedUserId.set(userId);
    this.showRoleModal.set(true);
    this.assignUserRoleService.getUserRoles(userId)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.selectedRoles.set(res.data);
          console.log(this.selectedRoles());
        }
      })
  }

  toggleRole(roleId: number) {
    this.selectedRoles.update(current => {
      let result;
      if (current.includes(roleId)) {
        result = current.filter(x => x !== roleId);
      } else {
        result = [...current, roleId];
      }
      console.log(result);
      return result;
    });
  }

  saveRoles() {
    const request = {
      userId: this.selectedUserId()!,
      roleIds: this.selectedRoles()
    };
    this.assignUserRoleService.assignRole(request).subscribe({
      next: () => {
        this.toast.success("Role assign successfully!");
        this.showRoleModal.set(false);
      }
    });

  }


}
