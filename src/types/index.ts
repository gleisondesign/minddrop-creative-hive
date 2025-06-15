
export type DropType = 'text' | 'link' | 'image' | 'audio';

export interface Drop {
  id: string;
  type: DropType;
  content: string; // URL for image/audio/link, text content for text
  createdAt: string;
  title?: string; // For links
}
