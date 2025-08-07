'use client';

import React, { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

interface CopyWorkspaceIdProps {
  workspaceId: string;
}

const CopyWorkspaceId: React.FC<CopyWorkspaceIdProps> = ({ workspaceId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(workspaceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset tooltip after 2s
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl w-full max-w-md mx-auto mt-4 shadow-lg relative">
      <div className="flex items-center justify-between">
        <code className="text-sm break-all">{workspaceId}</code>
        <button
          onClick={handleCopy}
          className="ml-4 p-2 rounded-md hover:bg-gray-800 transition-colors"
        >
          {copied ? <Check size={18} className="text-green-400" /> : <Clipboard size={18} />}
        </button>
      </div>
      {copied && (
        <div className="absolute top-0 right-0 mt-1 mr-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded-md">
          Copied!
        </div>
      )}
    </div>
  );
};

export default CopyWorkspaceId;
