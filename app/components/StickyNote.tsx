'use client';

import { useState, useEffect, useRef } from 'react';
import { StickyNote as StickyNoteType } from '../types/sticky-note';

interface StickyNoteProps {
  note: StickyNoteType;
  onUpdate: (note: StickyNoteType) => void;
  onDelete: (id: string) => void;
  onSend?: (note: StickyNoteType) => void;
}

export default function StickyNote({ note, onUpdate, onDelete, onSend }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(note.metadata.position);
  const [content, setContent] = useState(note.content);
  const [isSent, setIsSent] = useState(!!note.metadata.sent);
  const noteRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate({
          ...note,
          content,
          metadata: {
            ...note.metadata,
            position,
            sent: isSent
          }
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, note, content, position, onUpdate, isSent]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!noteRef.current) return;

    const rect = noteRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setIsDragging(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdate({
      ...note,
      content: e.target.value,
      metadata: {
        ...note.metadata,
        position,
        sent: isSent
      }
    });
  };

  const handleSend = () => {
    if (onSend) {
      setIsSent(true);
      onSend({
        ...note,
        content,
        metadata: {
          ...note.metadata,
          position,
          sent: true
        }
      });
    }
  };

  return (
    <div
      ref={noteRef}
      className="absolute shadow-lg rounded-lg p-4 min-w-[200px] min-h-[200px] cursor-move"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: note.metadata.color,
        transform: isDragging ? 'rotate(2deg)' : 'none',
        transition: isDragging ? 'none' : 'transform 0.2s ease',
        zIndex: isDragging ? 1000 : 1
      }}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        {!isSent && onSend && (
          <button
            onClick={handleSend}
            className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Send
          </button>
        )}
        <button
          onClick={() => onDelete(note.id)}
          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800"
        >
          ×
        </button>
      </div>
      <div className="h-4 cursor-move mb-2" onMouseDown={handleMouseDown} />
      <textarea
        className="w-full h-full bg-transparent resize-none focus:outline-none"
        value={content}
        onChange={handleContentChange}
        placeholder="Write your note here..."
        disabled={isSent}
      />
      {isSent && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          Sent ✓
        </div>
      )}
    </div>
  );
} 