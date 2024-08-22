import React, { useState, useRef, useEffect } from 'react';
import { Code, Eye, Search, Edit, Trash, Copy, MessageSquare } from 'lucide-react';

interface WebPreviewProps {
  code: string | null;
  onElementSelect: (elementInfo: { tag: string; id: string; className: string }, editRequest: string) => void;
  onSendMessage: (message: string) => void;
}

const WebPreview: React.FC<WebPreviewProps> = ({ code, onElementSelect, onSendMessage }) => {
  const [showCode, setShowCode] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number, element: HTMLElement } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInspectToggle = () => {
    setInspectMode(!inspectMode);
    setContextMenu(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!inspectMode) return;
    e.preventDefault();
    const target = e.target as HTMLElement;
    setContextMenu({ 
      x: e.clientX, 
      y: e.clientY, 
      element: target 
    });
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;
    const element = contextMenu.element;

    switch (action) {
      case 'ask-ai':
        onSendMessage(`Can you suggest improvements for this ${element.tagName.toLowerCase()} element?`);
        break;
      case 'edit':
        onElementSelect(
          { tag: element.tagName, id: element.id, className: element.className },
          'Edit this element'
        );
        break;
      case 'delete':
        element.remove();
        break;
      case 'duplicate':
        const clone = element.cloneNode(true) as HTMLElement;
        element.parentNode?.insertBefore(clone, element.nextSibling);
        break;
      case 'inspect':
        console.log(element);
        break;
    }
    setContextMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu && !((e.target as HTMLElement).closest('.context-menu'))) {
        setContextMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border border-gray-200 text-black">
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">DaisyUI Web</h2>
        <div className="flex bg-gray-200 rounded-md p-0.5">
          <button
            onClick={() => setShowCode(false)}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${!showCode ? 'bg-white font-semibold' : 'hover:bg-gray-100'}`}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
          <button
            onClick={() => setShowCode(true)}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${showCode ? 'bg-white font-semibold' : 'hover:bg-gray-100'}`}
          >
            <Code className="w-4 h-4 mr-1" />
            Code
          </button>
          <button
            onClick={handleInspectToggle}
            className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${inspectMode ? 'bg-white font-semibold' : 'hover:bg-gray-100'}`}
          >
            <Search className="w-4 h-4 mr-1" />
            Inspect
          </button>
        </div>
      </div>

      <div 
        className={`flex-1 overflow-auto p-4 relative ${inspectMode ? 'cursor-crosshair' : ''}`}
        onClick={handleClick}
      >
        {showCode ? (
          <pre className="bg-gray-50 text-gray-800 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap break-all">
            <code>{code}</code>
          </pre>
        ) : (
          <div
            ref={previewRef}
            className="bg-white p-4 rounded-lg min-h-full"
            dangerouslySetInnerHTML={{ __html: code || '' }}
          />
        )}
      </div>
      
      {contextMenu && (
        <div
          className="absolute bg-white shadow-lg rounded-lg py-2 z-50 context-menu"
          style={{ 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`
          }}
        >
          {[
            { label: 'Ask AI', icon: MessageSquare, action: 'ask-ai' },
            { label: 'Edit', icon: Edit, action: 'edit' },
            { label: 'Delete', icon: Trash, action: 'delete' },
            { label: 'Duplicate', icon: Copy, action: 'duplicate' },
            { label: 'Inspect', icon: Search, action: 'inspect' },
          ].map((item, index) => (
            <button
              key={index}
              className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => handleContextMenuAction(item.action)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebPreview;