// types/analytics.d.ts
declare module "@analytics/storage-utils" {
  export interface StorageOptions {
    storage?: "localStorage" | "sessionStorage";
  }

  export function setItem(
    key: string,
    value: any,
    options?: StorageOptions,
  ): void;

  export function getItem(key: string, options?: StorageOptions): any;

  export function removeItem(key: string, options?: StorageOptions): void;
}

export interface MessageFile {
  id: string;
  filename: string;
  type: string;
  url: string;
  mime_type: string;
  size: number;
  transfer_method: string;
  belongs_to: string;
  upload_file_id: string;
}
