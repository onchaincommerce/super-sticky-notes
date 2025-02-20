'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useXMTP } from './context/XMTPContext';
import StickyNote from './components/StickyNote';
import { StickyNote as StickyNoteType, StickyNoteMetadata } from './types/sticky-note';
import { WalletIsland } from '@coinbase/onchainkit/wallet';
import Welcome from './components/Welcome';
import Tooltip from './components/Tooltip';

const COLORS = [
  '#fef3c7', // Yellow
  '#fde68a', // Amber
  '#bfdbfe', // Blue
  '#bbf7d0', // Green
  '#ddd6fe', // Purple
];

export default function Home() {
  const { address } = useAccount();
  const { client, isLoading } = useXMTP();
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      if (!client || !address) return;

      try {
        // Load both sent and received notes
        const conversations = await client.conversations.list();
        const allNotes: StickyNoteType[] = [];

        for (const conversation of conversations) {
          const messages = await conversation.messages();
          const conversationNotes = messages
            .filter(msg => {
              try {
                const content = JSON.parse(msg.content);
                return content.type === 'sticky-note';
              } catch {
                return false;
              }
            })
            .map(msg => {
              const { note } = JSON.parse(msg.content);
              return {
                ...note,
                metadata: {
                  ...note.metadata,
                  sent: true // Mark loaded notes as sent
                }
              };
            });
          
          allNotes.push(...conversationNotes);
        }

        // Sort notes by creation time
        allNotes.sort((a, b) => b.metadata.createdAt - a.metadata.createdAt);
        setNotes(allNotes);
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    };

    loadNotes();
  }, [client, address]);

  const createNote = async () => {
    if (!client || !address) return;

    const timestamp = Date.now();
    const newNote: StickyNoteType = {
      id: timestamp.toString(),
      content: '',
      metadata: {
        position: { x: Math.random() * 300, y: Math.random() * 300 },
        color: selectedColor,
        createdAt: timestamp,
        sent: false // New notes start as unsent
      },
    };

    setNotes(prev => [...prev, newNote]);
  };

  const sendNote = async (note: StickyNoteType) => {
    if (!client || !address || !recipientAddress) return;

    try {
      const conversation = await client.conversations.newConversation(recipientAddress);
      await conversation.send(JSON.stringify({
        type: 'sticky-note',
        note: {
          ...note,
          metadata: {
            ...note.metadata,
            sent: true
          }
        },
      }));

      setNotes(prev =>
        prev.map(n => (n.id === note.id ? { ...note, metadata: { ...note.metadata, sent: true } } : n))
      );
    } catch (error) {
      console.error('Error sending note:', error);
    }
  };

  const updateNote = async (updatedNote: StickyNoteType) => {
    setNotes(prev =>
      prev.map(note => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  const deleteNote = async (id: string) => {
    if (!client || !address) return;

    try {
      // Only send delete message if the note was sent
      const noteToDelete = notes.find(note => note.id === id);
      if (noteToDelete?.metadata.sent && recipientAddress) {
        const conversation = await client.conversations.newConversation(recipientAddress);
        await conversation.send(JSON.stringify({
          type: 'sticky-note-delete',
          noteId: id,
        }));
      }

      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-screen paper-texture">
        <div className="text-center space-y-4">
          <img 
            src="/sticky_note_logo.png" 
            alt="Super Sticky Notes Logo" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <p className="text-xl">Please connect your wallet to use Super Sticky Notes</p>
          <WalletIsland />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen paper-texture">
        <div className="space-y-4 text-center">
          <div className="animate-bounce text-4xl">📝</div>
          <p className="text-xl">Loading XMTP...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen paper-texture">
      {showWelcome && <Welcome onClose={() => setShowWelcome(false)} />}
      <WalletIsland />
      
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-4 bg-white p-4 rounded-lg shadow-lg animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          <img 
            src="/sticky_note_logo.png" 
            alt="Logo" 
            className="w-6 h-6"
          />
          <span className="font-semibold text-gray-700">Super Sticky Notes</span>
        </div>
        
        <Tooltip text="Enter the wallet address of the note recipient. Use your own address to send notes to yourself!">
          <input
            type="text"
            placeholder="Enter recipient address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Tooltip>

        <Tooltip text="Choose a color for your next sticky note">
          <div className="flex gap-2">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full transform hover:scale-110 transition-transform ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500 animate-pulse' : ''
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Tooltip>

        <Tooltip text="Click to add a new sticky note to your canvas">
          <button
            onClick={createNote}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            Add Note ✨
          </button>
        </Tooltip>

        <div className="text-sm text-gray-500 italic mt-2 text-center">
          {notes.length === 0 ? (
            "No sticky notes yet - let's create one! 🎨"
          ) : (
            `${notes.length} sticky note${notes.length === 1 ? '' : 's'} in your collection 🎉`
          )}
        </div>
      </div>

      {notes.map(note => (
        <div key={note.id} className="animate-fade-in">
          <StickyNote
            note={note}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onSend={!note.metadata.sent ? sendNote : undefined}
          />
        </div>
      ))}
    </main>
  );
}

// Add these animations to your globals.css
const styles = `
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
`;
