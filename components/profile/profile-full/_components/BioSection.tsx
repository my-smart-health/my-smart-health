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
import SeeMoreLess from "@/components/buttons/see-more-less/SeeMoreLess";

export default function BioSection({ bio }: { bio: string }) {
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

  if (!bio) return null;

  return (
    <>
      <Divider addClass="my-4" />
      <section className="w-full overflow-hidden">
        <article className="text-base max-w-full">
          <SeeMoreLess>
            <div className="w-full overflow-hidden">
              <EditorContent editor={editor} />
            </div>
          </SeeMoreLess>
        </article>
      </section>
    </>
  );
}