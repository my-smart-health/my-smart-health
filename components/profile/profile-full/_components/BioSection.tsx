'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import Divider from "@/components/divider/Divider";
import { useState, useRef, useEffect } from 'react';

export default function BioSection({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  const [needsExpand, setNeedsExpand] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
        openOnClick: true,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: bio || '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none bio-content focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (!editor || !contentRef.current) return;

    const checkHeight = () => {
      if (contentRef.current) {
        // Check if content exceeds 3 lines (approximately 4.8em based on line-height 1.6)
        const maxHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) * 3;
        const actualHeight = contentRef.current.scrollHeight;
        setNeedsExpand(actualHeight > maxHeight + 5); // +5 for tolerance
      }
    };

    // Wait for editor to fully render
    const timer = setTimeout(checkHeight, 200);

    window.addEventListener('resize', checkHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkHeight);
    };
  }, [editor, bio]);

  if (!bio) return null;

  return (
    <>
      <Divider addClass="my-4" />
      <section className="w-full overflow-hidden">
        <article className="text-base w-full max-w-full">
          <div
            ref={contentRef}
            style={{
              maxHeight: expanded ? 'none' : '4.8em',
              overflow: 'hidden',
              lineHeight: '1.6',
              transition: 'max-height 0.3s ease',
            }}
          >
            <EditorContent editor={editor} />
          </div>
          {needsExpand && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary mt-2 cursor-pointer select-none italic hover:underline focus:outline-none"
              type="button"
            >
              {expanded ? "Weniger anzeigen" : "Mehr erfahren"}
            </button>
          )}
        </article>
      </section>
    </>
  );
}