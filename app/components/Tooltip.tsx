'use client';

import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className={`absolute ${positionClasses[position]} z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap opacity-90 pointer-events-none transform transition-opacity duration-200`}
        >
          {text}
          <div 
            className={`absolute ${
              position === 'top' ? 'bottom-[-6px] border-t-gray-900' :
              position === 'bottom' ? 'top-[-6px] border-b-gray-900' :
              position === 'left' ? 'right-[-6px] border-l-gray-900' :
              'left-[-6px] border-r-gray-900'
            } w-3 h-3 transform rotate-45 bg-gray-900`}
          />
        </div>
      )}
    </div>
  );
} 