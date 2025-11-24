import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Blockquote from '@tiptap/extension-blockquote';
import HardBreak from '@tiptap/extension-hard-break';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';

const baseExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    blockquote: false,
    hardBreak: false,
    codeBlock: false,
    horizontalRule: false,
    link: false,
    underline: false,
  }),
  Blockquote,
  HardBreak,
  Underline,
  TextStyle,
  Color,
];

export const getReadOnlyExtensions = () => [
  ...baseExtensions,
  Link.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: 'text-primary underline',
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
];

export const getEditorExtensions = (placeholder?: string) => [
  ...baseExtensions,
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
];
