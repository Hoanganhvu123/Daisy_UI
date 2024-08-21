import React, { useState, useRef, useEffect } from 'react';
import { Code, Eye, Search, X } from 'lucide-react';

interface WebPreviewProps {
  code: string | null;
  onElementSelect: (elementInfo: { tag: string; id: string; className: string }, editRequest: string) => void;
  onSendMessage: (message: string) => void;
}

const WebPreview: React.FC<WebPreviewProps> = ({ code, onElementSelect, onSendMessage }) => {
  const [showCode, setShowCode] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const handleInspectToggle = () => {
    setInspectMode(!inspectMode);
    setContextMenu(null);
  };

  const handleElementHover = (e: MouseEvent) => {
    if (!inspectMode) return;
    const target = e.target as HTMLElement;
    setHighlightedElement(target);
  };

  const handleElementUnhover = () => {
    if (!inspectMode) return;
    setHighlightedElement(null);
  };

  const handleElementClick = (e: MouseEvent) => {
    if (!inspectMode) return;
    e.preventDefault();
    const target = e.target as HTMLElement;
    setHighlightedElement(target);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuAction = (action: string) => {
    if (!highlightedElement) return;

    switch (action) {
      case 'ask-ai':
        onSendMessage(`Can you suggest improvements for this ${highlightedElement.tagName.toLowerCase()} element?`);
        break;
      case 'edit':
        // Implement edit logic
        console.log('Edit', highlightedElement);
        break;
      case 'delete':
        highlightedElement.remove();
        break;
      case 'duplicate':
        const clone = highlightedElement.cloneNode(true) as HTMLElement;
        highlightedElement.parentNode?.insertBefore(clone, highlightedElement.nextSibling);
        break;
      case 'inspect':
        console.log(highlightedElement);
        break;
      case 'copy-selector':
        const selector = generateSelector(highlightedElement);
        navigator.clipboard.writeText(selector);
        break;
    }
    setContextMenu(null);
  };

  const generateSelector = (element: HTMLElement): string => {
    return element.id ? `#${element.id}` : element.className ? `.${element.className.split(' ')[0]}` : element.tagName.toLowerCase();
  };

  useEffect(() => {
    if (previewRef.current && code) {
      const elements = previewRef.current.querySelectorAll('*');
      elements.forEach(el => {
        el.addEventListener('mouseover', handleElementHover as EventListener);
        el.addEventListener('mouseout', handleElementUnhover as EventListener);
        el.addEventListener('click', handleElementClick as EventListener);
      });

      return () => {
        elements.forEach(el => {
          el.removeEventListener('mouseover', handleElementHover as EventListener);
          el.removeEventListener('mouseout', handleElementUnhover as EventListener);
          el.removeEventListener('click', handleElementClick as EventListener);
        });
      };
    }
  }, [code, inspectMode]);

  useEffect(() => {
    if (highlightRef.current && highlightedElement) {
      const rect = highlightedElement.getBoundingClientRect();
      highlightRef.current.style.top = `${rect.top + window.scrollY}px`;
      highlightRef.current.style.left = `${rect.left + window.scrollX}px`;
      highlightRef.current.style.width = `${rect.width}px`;
      highlightRef.current.style.height = `${rect.height}px`;
    }
  }, [highlightedElement]);

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

      <div className={`flex-1 overflow-auto p-4 relative ${inspectMode ? 'cursor-crosshair' : ''}`}>
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
        {inspectMode && highlightedElement && (
          <div
            ref={highlightRef}
            className="absolute pointer-events-none border-2 border-blue-500 z-10 transition-all duration-200 ease-in-out"
          />
        )}
      </div>
      
      {contextMenu && (
        <div
          className="absolute bg-white shadow-lg rounded-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {[
            { label: 'Ask AI', icon: '🤖', action: 'ask-ai' },
            { label: 'Edit', icon: '✏️', action: 'edit' },
            { label: 'Delete', icon: '🗑️', action: 'delete' },
            { label: 'Duplicate', icon: '📋', action: 'duplicate' },
            { label: 'Inspect', icon: '🔍', action: 'inspect' },
            { label: 'Copy selector', icon: '📎', action: 'copy-selector' }
          ].map((item) => (
            <button
              key={item.action}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
              onClick={() => handleContextMenuAction(item.action)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebPreview;