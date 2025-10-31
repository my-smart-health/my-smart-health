"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Blockquote from "@tiptap/extension-blockquote";
import HardBreak from "@tiptap/extension-hard-break";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect, useRef, useState } from "react";

export default function MSHParagraphContent({ content }: { content: string }) {
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
        HTMLAttributes: { class: "text-primary underline" },
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
        class: "bio-content max-w-none focus:outline-none",
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
    if (!editor || !contentRef.current) return;

    const checkHeight = () => {
      if (contentRef.current) {
        const maxHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight) * 3;
        const actualHeight = contentRef.current.scrollHeight;
        setNeedsExpand(actualHeight > maxHeight + 5);
      }
    };

    const handler: () => void = () => {
      requestAnimationFrame(checkHeight);
    };
    editor.on('create', handler);
    editor.on('update', handler);
    requestAnimationFrame(checkHeight);
    window.addEventListener("resize", checkHeight);

    return () => {
      editor.off('create', handler);
      editor.off('update', handler);
      window.removeEventListener("resize", checkHeight);
    };
  }, [editor, content]);

  if (!content) return null;

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={contentRef}
        className="bio-content"
        style={{
          maxHeight: expanded ? "none" : "7em",
          overflow: "hidden",
          lineHeight: "1.6",
          transition: "max-height 0.3s ease",
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
    </div>
  );
}
