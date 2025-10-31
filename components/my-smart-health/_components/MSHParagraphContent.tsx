"use client";

import ParagraphContent from "@/components/common/ParagraphContent";

export default function MSHParagraphContent({ content }: { content: string }) {
  return <ParagraphContent content={content} maxLines={3} />;
}
