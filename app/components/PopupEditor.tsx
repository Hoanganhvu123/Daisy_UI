// components/PopupEditor.tsx
import React, { useState } from 'react';

interface PopupEditorProps {
  element: HTMLElement;
  onClose: () => void;
  onSubmit: (editRequest: string) => void;
}

const PopupEditor: React.FC<PopupEditorProps> = ({ element, onClose, onSubmit }) => {
  const [editRequest, setEditRequest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editRequest);
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md shadow-lg">
      <h3 className="text-lg font-semibold mb-2">Edit Element</h3>
      <p>
        <strong>Tag:</strong> {element.tagName.toLowerCase()}
        {element.id && <span>, <strong>ID:</strong> {element.id}</span>}
        {element.className && <span>, <strong>Class:</strong> {element.className}</span>}
      </p>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={editRequest}
          onChange={(e) => setEditRequest(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Describe your changes..."
          rows={4}
        />
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupEditor;