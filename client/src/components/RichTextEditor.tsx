import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Smile,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  minHeight = 'min-h-48'
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (linkUrl && editorRef.current) {
      editorRef.current.focus();
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      execCommand('insertText', emoji);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Link and Image */}
        <div className="flex items-center gap-1 pr-3 border-r border-gray-300 dark:border-gray-600">
          <button
            type="button"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => {
              const url = prompt('Enter image URL:');
              if (url) execCommand('insertImage', url);
            }}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Emoji */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group"
              title="Insert Emoji"
            >
              <Smile className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg z-10">
              <div className="grid grid-cols-5 gap-1">
                {['😊', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💯'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              onKeyPress={(e) => e.key === 'Enter' && insertLink()}
            />
            <button
              type="button"
              onClick={insertLink}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => setShowLinkInput(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={`p-4 ${minHeight} focus:outline-none text-gray-900 dark:text-gray-100 leading-relaxed prose prose-sm max-w-none`}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{ minHeight: '200px' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .dark [contenteditable]:empty:before {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;