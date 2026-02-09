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
