'use client';

import { useState } from 'react';

interface WelcomeProps {
  onClose: () => void;
}

export default function Welcome({ onClose }: WelcomeProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-xl p-8 max-w-2xl mx-4 shadow-2xl transform transition-all animate-fade-in">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img 
            src="/sticky_note_logo.png" 
            alt="Super Sticky Notes Logo" 
            className="w-16 h-16"
          />
          <h1 className="text-3xl font-bold text-blue-600">Welcome to Super Sticky Notes! ✨</h1>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-lg">
            Create and send colorful sticky notes on the blockchain using XMTP! 
            Think of it as Web3 Post-its with superpowers! 🚀
          </p>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">How it works:</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Connect your wallet using the floating wallet button</li>
              <li>Click <span className="font-mono bg-blue-100 px-2 rounded">Add Note</span> to create a new sticky</li>
              <li>Drag your note anywhere on the screen</li>
              <li>Choose fun colors for each note</li>
              <li>Enter a recipient&apos;s address to send your note</li>
              <li>Click <span className="font-mono bg-green-100 px-2 rounded">Send</span> when you&apos;re ready!</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Pro Tips! 💡</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Send notes to yourself by using your own address</li>
              <li>Once sent, notes are permanent and can&apos;t be edited</li>
              <li>Your notes&apos; positions are saved exactly where you place them</li>
              <li>Come back anytime to see your sticky note collection!</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
        >
          Let&apos;s Get Sticky! 🎉
        </button>
      </div>
    </div>
  );
} 