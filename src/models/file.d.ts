export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface UploadFile<T = any> {
  uid: string;
  size: number;
  name: string;
  fileId?: string;
  filename?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  originFileObj?: File | Blob;
  response?: T;
  error?: any;
  linkProps?: any;
  type: string;
  xhr?: T;
  preview?: string;
}

// Interface describes thumbnail property of the FileModel
export interface FileThumbnail {
  width: number;
  signedUrl: string;
}

// Interface describes data model of a file from the file-server
export interface FileModel {
  fileId: string;
  profileId: string;
  filename: string;
  thumbnails: FileThumbnail[];
  signedUrl: string | null;
}
