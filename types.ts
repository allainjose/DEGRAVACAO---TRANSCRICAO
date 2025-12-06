export enum TranscriptionStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface TranscriptionResult {
  text: string;
  timestamp: string;
  filename: string;
}

export interface FileData {
  name: string;
  type: string;
  size: number;
  base64: string;
}

export enum TabOption {
  UPLOAD = 'UPLOAD',
  URL = 'URL'
}

export interface HistoryItem {
  id: string;
  filename: string;
  markdown: string;
  timestamp: Date;
}