export {};

declare global {
  export interface QuicklookData {
    type?: 'html' | 'image' | 'markdown' | 'text' | 'pdf';
    data?: string | Promise<string>;
    active: boolean;
    script?: string;
  }
}
