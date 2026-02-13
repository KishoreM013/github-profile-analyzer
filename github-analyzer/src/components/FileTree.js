import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';

const FileTree = ({ node }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Safety check to ensure node exists
  if (!node) return null;

  const isFolder = node.type === 'tree';

  return (
    <div style={{ marginLeft: '15px', fontFamily: 'monospace' }}>
      <div 
        onClick={() => isFolder && setIsOpen(!isOpen)}
        style={{ cursor: isFolder ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}
      >
        {isFolder ? (isOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <span style={{width: 14}}></span>}
        {isFolder ? <Folder size={16} color="#8b5cf6" /> : <FileText size={16} color="#9ca3af" />}
        <span style={{ color: isFolder ? '#fff' : '#9ca3af' }}>{node.name}</span>
      </div>
      
      {isOpen && node.children && (
        <div>
          {Object.values(node.children).map((child, i) => (
            <FileTree key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileTree;