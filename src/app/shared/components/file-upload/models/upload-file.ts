export interface UploadFile {

  id: string;

  file?: File;

  name: string;

  size: number;

  type: string;

  preview?: string;

  progress: number;

  uploaded: boolean;

  uploading: boolean;

  failed: boolean;

  error?: string;

  url?: string;

  isMain?: boolean;
retryCount?:number;

serverId?:number;

thumbnail?:string;

compressed?:boolean;

cropped?:boolean;

order?:number;

createdAt?:Date;
}