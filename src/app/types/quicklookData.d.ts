export {};

declare global {
  export interface QuicklookData {
    type?: 'html' | 'image' | 'markdown' | 'text';
    data?: string | Promise<string>;
    active: boolean;
  }
}
