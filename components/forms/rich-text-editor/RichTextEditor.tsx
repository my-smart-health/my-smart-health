'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * Professional rich text editor for bio content.
 * Uses StarterKit with carefully configured extensions to avoid conflicts.
 */
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isSettingFromParent = useRef(false);
  const [toolbarKey, setToolbarKey] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: false,
        hardBreak: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Blockquote,
      HardBreak,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your bio...',
      }),
      TextStyle,
      Color,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      if (isSettingFromParent.current) return;
      const html = editor.getHTML();
      onChange(html);
      // Trigger toolbar refresh to update active states
      setToolbarKey(k => k + 1);
    },
    onSelectionUpdate: () => {
      // Update toolbar when selection changes
      setToolbarKey(k => k + 1);
    },
  });

  // Sync value from parent to editor (only when not focused)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const currentContent = editor.getHTML();
    const newContent = value || '';

    // Skip if content is the same
    if (currentContent === newContent) return;

    // Skip if editor is focused (user is typing)
    if (editor.isFocused) return;

    // Set content without triggering onUpdate
    isSettingFromParent.current = true;
    editor.commands.setContent(newContent, { emitUpdate: false });

    // Small delay to ensure state is flushed
    requestAnimationFrame(() => {
      isSettingFromParent.current = false;
    });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="border border-primary rounded bg-white p-3 min-h-[200px] animate-pulse">
        <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
      </div>
    );
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
  }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      // CRITICAL: Prevent ALL default behavior and event propagation
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      // Execute the command directly on mousedown to avoid any click event issues
      onClick();
    };

    return (
      <button
        type="button"
        onMouseDown={handleMouseDown}
        // Disable onClick entirely to avoid double-firing or event bubbling issues
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        disabled={disabled}
        className={`btn btn-xs ${isActive ? 'btn-primary' : 'btn-ghost'} ${disabled ? 'btn-disabled' : ''}`}
        title={title}
      >
        {children}
      </button>
    );
  };

  const commonColors = [
    '#000000', '#EF4444', '#10B981', '#3B82F6', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6B7280'
  ];

  return (
    <div className="tiptap-editor border border-primary rounded bg-white">
      <div
        className="border-b border-primary p-2 flex flex-wrap gap-1 bg-base-200"
        key={toolbarKey}
        onMouseDown={(e) => {
          // Prevent toolbar area from interfering with editor focus
          // Only stop propagation if the click is on the toolbar background, not buttons
          const target = e.target as HTMLElement;
          if (target.classList.contains('bg-base-200') || target.classList.contains('divider')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          P
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="btn btn-xs btn-ghost"
            title="Text Color"
          >
            <span style={{ color: editor.getAttributes('textStyle').color || '#000000' }}>
              A
            </span>
          </button>

          {showColorPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowColorPicker(false);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <div className="absolute z-50 bg-white border border-primary rounded shadow-lg p-2 mt-1 flex flex-wrap gap-1 w-48 left-0">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      editor.chain().focus().setColor(color).run();
                      setShowColorPicker(false);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    title={color}
                  />
                ))}
                <button
                  type="button"
                  className="btn btn-xs btn-ghost w-full mt-1"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          1. List
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          ❝❞
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title="Line Break (Shift+Enter)"
        >
          ↵
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          ⇤
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          ⇔
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          ⇥
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
