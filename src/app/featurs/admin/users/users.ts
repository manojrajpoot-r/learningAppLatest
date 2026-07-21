import { Component, inject ,input} from '@angular/core';
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
import { Modal } from '../../../shared/components/modal/modal';
import { DynamicForm } from '../../../shared/components/dynamic-form/dynamic-form';
import { AppPageHeader } from '../../../shared/components/app-page-header/app-page-header';
import { DynamicField } from '../../../shared/components/dynamic-form/dynamic-form';
import { AppToolbar } from '../../../shared/components/app-toolbar/app-toolbar';
import { AppFilterPanel } from '../../../shared/components/app-filter-panel/app-filter-panel';
@Component({
  selector: 'app-users',
  standalone:true,
  imports: [
     ReactiveFormsModule, 
     Table, DatePipe, MatCard,
     MatCardHeader, MatCardTitle,
     Modal,DynamicForm,AppPageHeader,AppToolbar,AppFilterPanel
    ],
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
  filterVisible = signal(false);

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
    action:'edit',
    icon:'bi bi-pencil',
    severity:'info',
    tooltip:'Edit User',
    rounded:true,
    size:'sm'
},
{
    action:'delete',
    icon:'bi bi-trash',
    severity:'danger',
    confirm:{
        title:'Delete User',
        message:'Are you sure you want to delete this user?',
        confirmText:'Delete',
        cancelText:'Cancel'
    }
},
{
    action:'toggleStatus',
    label:(row)=>row.isActive
        ?'Disable'
        :'Enable',

    tooltip:(row)=>row.isActive
        ?'Disable User'
        :'Enable User',

    icon:(row)=>row.isActive
        ?'bi bi-lock-fill'
        :'bi bi-unlock-fill',

    severity:(row)=>row.isActive
        ?'warning'
        :'success',

    rounded:true,

    size:'sm'
},
{
    action:'assignRole',
    icon:'bi bi-lock',
    severity:'info',
    tooltip:'Assign Role',
    rounded:true,
    size:'sm'
},

];

handleAction(event: { action: string; row: any }) {
  switch (event.action) {
    case 'edit':
      this.openEditModal(event.row.id);
      break;

    case 'delete':
      this.userService.deleteUser(event.row.id).subscribe({
        next: () => {
          this.toast.success('Deleted');
          this.users.reload();
        }
      });
      break;

    case 'toggleStatus':
      this.toggleStatus(event.row);
      break;

      case 'assignRole':
      this.openAssignRoleModal(event.row);
      break;
  }
}

fields: DynamicField[] = [
  {
    type: 'text',
    name: 'fullName',
    label: 'Full Name',
    col: 6
  },
  {
    type: 'email',
    name: 'email',
    label: 'Email',
    col: 6
  },
  {
    type: 'password',
    name: 'password',
    label: 'Password',
    col: 12,
    hidden: false
  }
];
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
resetFilter(){

}
applyFilter(){

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
    this.fields.find(x => x.name === 'password')!.hidden = false;
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
  this.fields.find(x => x.name === 'password')!.hidden = true;
  this.handleForm.reset();
  this.handleForm.get('password')?.clearValidators();
  this.handleForm.get('password')?.updateValueAndValidity();
  this.isEditMode.set(true);
  this.selectedEditId.set(id);
  this.userService.getUserById(id).subscribe({
    next: (res) => {
      this.handleForm.patchValue({
        fullName: res.data.fullName,
        email: res.data.email
      });
      this.visible.set(true);
    }
  });
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
