import React from 'react';
import { useContent } from '../contexts/ContentContext';

interface EditableTextProps {
  contentKey: string;
  className?: string;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ contentKey, className, multiline }) => {
  const { content, updateContent, isEditMode } = useContent();
  const value = content[contentKey] || '';

  if (!isEditMode) {
    if (multiline) {
      return <p className={className}>{value}</p>;
    }
    return <span className={className}>{value}</span>;
  }

  if (multiline) {
    return (
      <textarea
        className={`${className} w-full p-2 border-2 border-orange-400 bg-orange-50/50 rounded-md focus:outline-none min-h-[100px]`}
        value={value}
        onChange={(e) => updateContent(contentKey, e.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      className={`${className} w-full p-2 border-2 border-orange-400 bg-orange-50/50 rounded-md focus:outline-none`}
      value={value}
      onChange={(e) => updateContent(contentKey, e.target.value)}
    />
  );
};

export default EditableText;
