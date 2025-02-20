export interface StickyNotePosition {
  x: number;
  y: number;
}

export interface StickyNoteMetadata {
  position: StickyNotePosition;
  color: string;
  createdAt: number;
  sent: boolean;
}

export interface StickyNote {
  id: string;
  content: string;
  metadata: StickyNoteMetadata;
} 