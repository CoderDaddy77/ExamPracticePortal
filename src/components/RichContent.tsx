/**
 * RichContent — renders text that may contain HTML (images, formatting, math symbols).
 * Falls back to plain text display if content has no HTML.
 * Used for question text, options, and explanations.
 */
interface RichContentProps {
  content: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

// Quick check: does the string contain HTML tags?
const containsHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

export function RichContent({ content, className = '', as: Tag = 'span' }: RichContentProps) {
  if (!content) return null;

  if (containsHtml(content)) {
    return (
      <Tag
        className={`rich-content ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Plain text — render normally
  return <Tag className={className}>{content}</Tag>;
}
