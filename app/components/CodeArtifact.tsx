import React, { useState } from 'react';

interface CodeArtifactProps {
  code: string;
}

const CodeArtifact: React.FC<CodeArtifactProps> = ({ code }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showPreview ? 'Show Code' : 'Show Preview'}
        </button>
      </div>
      {showPreview ? (
        <div className="border p-4 rounded" dangerouslySetInnerHTML={{ __html: code }} />
      ) : (
        <div className="bg-gray-900 text-white p-4 rounded-md">
          <pre><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
};

export default CodeArtifact;