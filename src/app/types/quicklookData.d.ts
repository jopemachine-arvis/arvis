export {};

declare global {
  export interface QuicklookData {
    active: boolean;
    asyncQuicklookItemUid?: string;
    data?: string | Promise<string>;
    script?: string;
    type?: 'html' | 'image' | 'markdown' | 'text' | 'pdf';
  }
}
