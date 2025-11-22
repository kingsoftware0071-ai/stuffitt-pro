
import React, { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  text: string;
  isEditing: boolean;
  onSave: (newText: string) => void;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  style?: React.CSSProperties;
  multiline?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  text, 
  isEditing, 
  onSave, 
  className = '', 
  tag = 'div',
  style,
  multiline = false
}) => {
  const [content, setContent] = useState(text);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setContent(text);
  }, [text]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newText = e.currentTarget.innerText;
    if (newText !== text) {
      onSave(newText);
    }
  };

  const Tag = tag;

  return (
    <Tag
      ref={elementRef as any}
      contentEditable={isEditing}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      className={`${className} ${
        isEditing 
          ? 'outline-dashed outline-2 outline-orange-400 hover:bg-orange-50/50 cursor-text transition-all rounded px-1 min-w-[10px]' 
          : ''
      }`}
      style={{
          ...style,
          whiteSpace: multiline ? 'pre-wrap' : 'normal'
      }}
    >
      {content}
    </Tag>
  );
};

export default EditableText;
