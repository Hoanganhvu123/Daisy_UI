import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const menuItems = [
    { label: 'Ask AI 🤖', action: 'ask-ai' },
    { label: 'Edit ✏️', action: 'edit' },
    { label: 'Delete 🗑️', action: 'delete' },
    { label: 'Duplicate 📋', action: 'duplicate' },
    { label: 'Inspect 🔍', action: 'inspect' },
    { label: 'Copy selector 📎', action: 'copy-selector' },
  ];

  useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return createPortal(
    <div 
      className="absolute bg-white shadow-lg rounded-lg py-2 z-50"
      style={{ top: y, left: x }}
    >
      {menuItems.map((item) => (
        <button
          key={item.action}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          onClick={() => onAction(item.action)}
        >
          {item.label}
        </button>
      ))}
    </div>,
    document.body
  );
};

export default ContextMenu;