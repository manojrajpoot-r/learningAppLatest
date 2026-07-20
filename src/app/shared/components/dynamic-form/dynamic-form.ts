import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
export interface DynamicField {

  type:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'date'
    | 'file';

  name: string;

  label: string;

  placeholder?: string;

  options?: {
    label: string;
    value: any;
  }[];

  col?: number;          // Bootstrap Grid

  readonly?: boolean;

  disabled?: boolean;

  hidden?: boolean;

  hint?: string;

  icon?: string;

  multiple?: boolean;

}
@Component({
  selector: 'app-dynamic-form',
  imports: [],
  templateUrl: './dynamic-form.html',
  styleUrl: './dynamic-form.css',
})
export class DynamicForm {
   fields = input.required<any[]>();
   form = input.required<FormGroup>();
}
