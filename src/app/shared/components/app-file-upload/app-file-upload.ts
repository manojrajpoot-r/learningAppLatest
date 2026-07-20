  import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-app-file-upload',
  imports: [],
  templateUrl: './app-file-upload.html',
  styleUrl: './app-file-upload.css',
})
export class AppFileUpload {

  multiple = input(false);
  accept = input('image/*');
  maxSize = input(2 * 1024 * 1024);
  label = input('Upload Image');
  preview = signal<string[]>([]);
  files = signal<File[]>([]);
  fileChange = output<File[]>();


  onSelect(event: Event){
    const input = event.target as HTMLInputElement;
    if(!input.files) return;
    const selected = Array.from(input.files);
    this.files.set(selected);
    this.fileChange.emit(selected);
    const images = selected.map(file=>URL.createObjectURL(file));
    this.preview.set(images);

  }

  remove(index:number){
    const files=[...this.files()];
    files.splice(index,1);
    this.files.set(files);
    this.fileChange.emit(files);
    this.preview.set(
      files.map(x=>URL.createObjectURL(x))
    );
  }
}
