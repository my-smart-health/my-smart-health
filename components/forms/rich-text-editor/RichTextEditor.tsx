'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import { useEffect, useCallback, useState } from 'react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        blockquote: false,
        hardBreak: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Write your bio...',
      }),
      TextStyle,
      Color,
      Blockquote.configure({
        HTMLAttributes: {
          class: 'blockquote-custom',
        },
      }),
      HardBreak,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const isSame = editor.getHTML() === value;
    if (isSame) return;

    if (editor.isFocused) return;

    editor.commands.setContent(value || '', { emitUpdate: false });
  }, [value, editor]);

  const handleToolbarClick = useCallback((action: () => boolean) => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  }, []);

  const handleColorChange = useCallback((color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
      setSelectedColor(color);
    }
  }, [editor]);

  const commonColors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080'
  ];

  if (!editor) {
    return (
      <div className="border border-primary rounded bg-white p-3 min-h-[200px] animate-pulse">
        <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-base-300 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="tiptap-editor border border-primary rounded bg-white">
      <div className="border-b border-primary p-2 flex flex-wrap gap-1 bg-base-200" onMouseDown={(e) => e.preventDefault()}>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
          className={`btn btn-xs ${editor.isActive('heading', { level: 1 }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`btn btn-xs ${editor.isActive('heading', { level: 2 }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          className={`btn btn-xs ${editor.isActive('heading', { level: 3 }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().setParagraph().run())}
          className={`btn btn-xs ${editor.isActive('paragraph') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Paragraph"
        >
          P
        </button>

        <div className="divider divider-horizontal m-0"></div>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleBold().run())}
          className={`btn btn-xs ${editor.isActive('bold') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleItalic().run())}
          className={`btn btn-xs ${editor.isActive('italic') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleUnderline().run())}
          className={`btn btn-xs ${editor.isActive('underline') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleStrike().run())}
          className={`btn btn-xs ${editor.isActive('strike') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Strikethrough"
        >
          <s>S</s>
        </button>

        <div className="divider divider-horizontal m-0"></div>

        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
            }}
            className="btn btn-xs btn-ghost"
            tabIndex={-1}
            title="Text Color"
          >
            <span style={{ color: selectedColor }}>A</span>
          </button>
          {showColorPicker && (
            <div className="absolute z-50 bg-white border border-primary rounded shadow-lg p-2 mt-1 flex flex-wrap gap-1 w-48" style={{ top: '100%', left: 0 }}>
              {commonColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorChange(color);
                    setShowColorPicker(false);
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
                  setSelectedColor('#000000');
                  setShowColorPicker(false);
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="divider divider-horizontal m-0"></div>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleBulletList().run())}
          className={`btn btn-xs ${editor.isActive('bulletList') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleOrderedList().run())}
          className={`btn btn-xs ${editor.isActive('orderedList') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="divider divider-horizontal m-0"></div>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().toggleBlockquote().run())}
          className={`btn btn-xs ${editor.isActive('blockquote') ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Blockquote"
        >
          ❝❞
        </button>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().setHardBreak().run())}
          className="btn btn-xs btn-ghost"
          tabIndex={-1}
          title="Line Break (Shift+Enter)"
        >
          ↵
        </button>

        <div className="divider divider-horizontal m-0"></div>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().undo().run())}
          className="btn btn-xs btn-ghost"
          tabIndex={-1}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().redo().run())}
          className="btn btn-xs btn-ghost"
          tabIndex={-1}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          ↷
        </button>

        <div className="divider divider-horizontal m-0"></div>

        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().setTextAlign('left').run())}
          className={`btn btn-xs ${editor.isActive({ textAlign: 'left' }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Align Left"
        >
          ⇤
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().setTextAlign('center').run())}
          className={`btn btn-xs ${editor.isActive({ textAlign: 'center' }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Align Center"
        >
          ⇔
        </button>
        <button
          type="button"
          onMouseDown={handleToolbarClick(() => editor.chain().focus().setTextAlign('right').run())}
          className={`btn btn-xs ${editor.isActive({ textAlign: 'right' }) ? 'btn-primary' : 'btn-ghost'}`}
          tabIndex={-1}
          title="Align Right"
        >
          ⇥
        </button>

      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
