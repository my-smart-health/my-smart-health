"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import { TextStyle } from "@tiptap/extension-text-style";

type ParagraphContentProps = {
  content: string;
  maxLines?: number;
  className?: string;
};

export default function ParagraphContent({ content, maxLines = 3, className = "" }: ParagraphContentProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const clampLines = Math.max(1, Math.min(maxLines, 10));

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
        HTMLAttributes: {
          class: "text-primary underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: content || "",
    editable: false,
    editorProps: {
      attributes: {
        class: `bio-content max-w-none focus:outline-none ${className}`,
        style: expanded
          ? ''
          : `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${clampLines}; overflow: hidden;`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = content || "";
    if (editor.getHTML() !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, content]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: `bio-content max-w-none focus:outline-none ${className}`,
          style: expanded
            ? ''
            : `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${clampLines}; overflow: hidden;`,
        },
      },
    });
  }, [editor, expanded, clampLines, className]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || !editor) return;

    const getLineHeightPx = () => {
      const prosemirror = el.querySelector('.ProseMirror');
      if (!prosemirror) return 24;
      const cs = getComputedStyle(prosemirror);
      const lh = cs.lineHeight;
      if (lh === 'normal') {
        const fontSize = parseFloat(cs.fontSize) || 16;
        return 1.6 * fontSize;
      }
      const px = parseFloat(lh);
      return isNaN(px) ? 24 : px;
    };

    const recompute = () => {
      const prosemirror = el.querySelector('.ProseMirror') as HTMLElement;
      if (!prosemirror) return;

      const hasOverflow = prosemirror.scrollHeight > prosemirror.clientHeight + 5; // +5px tolerance
      setIsClamped(hasOverflow);
    };

    const rafId = requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => recompute());
      resizeObserver.observe(el);
    }

    const mutationObserver = new MutationObserver(() => recompute());
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', recompute);
      if (resizeObserver) resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [editor, clampLines, content]);

  if (!content) return null;

  const showToggle = isClamped || expanded;

  return (
    <div className="w-full" ref={contentRef}>
      <EditorContent editor={editor} />
      {showToggle && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-primary mt-2 cursor-pointer select-none italic hover:underline focus:outline-none"
          type="button"
        >
          {expanded ? 'Weniger anzeigen' : 'Mehr erfahren'}
        </button>
      )}
    </div>
  );
}
