'use client';

import Link from "next/link";
import Image from "next/image";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';

export default function ProfileShort({ id, name, bio, image }: { id: string; name: string; bio: string; image: string }) {
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
      LinkExtension.configure({
        openOnClick: false,
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
        class: 'prose prose-sm max-w-none bio-content focus:outline-none line-clamp-2',
      },
    },
  });

  return (
    <section className="flex flex-col md:flex-row items-center gap-4 p-4 w-full border rounded-xl bg-white/90 shadow-lg hover:shadow-2xl transition-shadow">
      <div className="flex-shrink-0 flex items-center justify-center w-full md:w-40 h-40 bg-gray-100 rounded-xl overflow-hidden border">
        <Image
          src={image}
          alt={name}
          loading="lazy"
          width={160}
          height={160}
          style={{ objectFit: "cover" }}
          className="rounded-xl w-full h-full"
        />
      </div>
      <div className="flex flex-col justify-between flex-1 w-full h-full gap-2">
        <h2 className="font-bold text-xl text-primary mb-1">{name}</h2>
        <div className="line-clamp-2">
          <EditorContent editor={editor} />
        </div>
        <div className="flex justify-end mt-2">
          <Link
            href={`/profile/${id}`}
            className="btn btn-primary btn-sm rounded-full px-6 font-semibold shadow"
          >
            View Profile
          </Link>
        </div>
      </div>
    </section>
  );
}