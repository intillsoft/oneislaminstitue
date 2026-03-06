/**
 * TipTap Rich Text Editor Component
 * Professional resume section editor with custom formatting
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, List, ListOrdered, Link as LinkIcon, 
  AlignLeft, AlignCenter, AlignRight, Undo, Redo,
  Save, Download, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const TipTapEditor = ({
  content = '',
  onChange,
  placeholder = 'Start typing...',
  autoSave = true,
  autoSaveInterval = 30000,
  onSave,
  onExport,
  showToolbar = true,
  minHeight = '200px',
  className = '',
}) => {
  const autoSaveTimerRef = useRef(null);
  const lastSavedRef = useRef(Date.now());

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: {
          depth: 50, // Enable undo/redo
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-workflow-primary underline hover:text-workflow-primary-600',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      
      if (onChange) {
        onChange({ html, text, json: editor.getJSON() });
      }

      // Auto-save
      if (autoSave) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = setTimeout(() => {
          if (onSave) {
            onSave({ html, text, json: editor.getJSON() });
            lastSavedRef.current = Date.now();
          }
        }, autoSaveInterval);
      }
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  // Manual save
  const handleSave = useCallback(() => {
    if (!editor) return;
    
    const html = editor.getHTML();
    const text = editor.getText();
    const json = editor.getJSON();

    if (onSave) {
      onSave({ html, text, json });
      lastSavedRef.current = Date.now();
    }
  }, [editor, onSave]);

  // Export functions
  const handleExportHTML = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (onExport) {
      onExport('html', html);
    } else {
      // Default export
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-section.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [editor, onExport]);

  const handleExportText = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    if (onExport) {
      onExport('text', text);
    } else {
      // Default export
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-section.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [editor, onExport]);

  if (!editor) {
    return <div className="animate-pulse">Loading editor...</div>;
  }

  return (
    <div className={`border border-border rounded-2xl overflow-hidden bg-surface ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between p-2.5 border-b border-border bg-surface-elevated flex-wrap gap-2">
          {/* Formatting Tools */}
          <div className="flex items-center gap-1 flex-wrap">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              aria-label="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              aria-label="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              aria-label="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              aria-label="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              aria-label="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              aria-label="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter URL');
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              isActive={editor.isActive('link')}
              aria-label="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>

            <div className="w-px h-6 bg-border mx-1" />

            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              aria-label="Undo"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              aria-label="Redo"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {autoSave && (
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted hidden sm:block">
                {Math.floor((Date.now() - lastSavedRef.current) / 1000) < 30 ? 'Synchronized' : 'Syncing...'}
              </span>
            )}
            <ToolbarButton
              onClick={handleSave}
              aria-label="Save"
              className="text-workflow-primary"
            >
              <Save className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={handleExportHTML}
              aria-label="Export HTML"
            >
              <Download className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="relative" style={{ minHeight }}>
        <EditorContent 
          editor={editor} 
          className="tiptap-editor"
        />
      </div>

      {/* Character Count (optional) */}
      <div className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-text-muted border-t border-border bg-surface-elevated">
        {editor.storage.characterCount?.characters() || editor.getText().length} UNITS DETECTED
      </div>
    </div>
  );
};

// Toolbar Button Component
const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        p-2 rounded-xl transition-all duration-200 min-h-touch min-w-touch
        ${isActive 
          ? 'bg-workflow-primary/10 text-workflow-primary' 
          : 'text-text-secondary hover:bg-surface-elevated'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default TipTapEditor;

