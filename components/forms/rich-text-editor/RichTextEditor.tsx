'use client';

import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { getEditorExtensions } from '@/utils/tiptap-extensions';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isSettingFromParent = useRef(false);
  const t = useTranslations('RichTextEditor');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(placeholder),
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
    },
  });

  useEffect(() => {
    if (!editor || editor.isDestroyed) return;

    const currentContent = editor.getHTML();
    const newContent = value || '';

    if (currentContent === newContent) return;

    if (editor.isFocused) return;

    isSettingFromParent.current = true;
    editor.commands.setContent(newContent, { emitUpdate: false });

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
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        if (!disabled) {
          onClick();
        }
      }}
      disabled={disabled}
      className={`btn btn-xs ${isActive ? 'btn-primary' : 'btn-ghost'} ${disabled ? 'btn-disabled' : ''}`}
      title={title}
    >
      {children}
    </button>
  );

  const commonColors = [
    '#000000', '#EF4444', '#10B981', '#3B82F6', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6B7280'
  ];

  return (
    <div className="tiptap-editor border border-primary rounded bg-white">
      <div className="border-b border-primary p-2 flex flex-wrap gap-1 bg-base-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title={t('toolbar.undo')}
        >
          ↶
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title={t('toolbar.redo')}
        >
          ↷
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title={t('toolbar.heading1')}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title={t('toolbar.heading2')}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title={t('toolbar.heading3')}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title={t('toolbar.paragraph')}
        >
          P
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title={t('toolbar.bold')}
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title={t('toolbar.italic')}
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title={t('toolbar.underline')}
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title={t('toolbar.strikethrough')}
        >
          <s>S</s>
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setShowColorPicker(!showColorPicker);
            }}
            className="btn btn-xs btn-ghost"
            title={t('toolbar.textColor')}
          >
            <span style={{ color: editor.getAttributes('textStyle').color || '#000000' }}>
              A
            </span>
          </button>

          {showColorPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPicker(false)}
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
                      editor.chain().focus().setColor(color).run();
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
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                >
                  {t('toolbar.resetColor')}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title={t('toolbar.bulletList')}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title={t('toolbar.numberedList')}
        >
          1. List
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title={t('toolbar.blockquote')}
        >
          ❝❞
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title={t('toolbar.lineBreak')}
        >
          ↵
        </ToolbarButton>

        <div className="divider divider-horizontal m-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title={t('toolbar.alignLeft')}
        >
          ⇤
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title={t('toolbar.alignCenter')}
        >
          ⇔
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title={t('toolbar.alignRight')}
        >
          ⇥
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
