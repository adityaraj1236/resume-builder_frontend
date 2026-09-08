// Minimal inline formatting for generated prose - only **bold** is recognized,
// deliberately not a full markdown parser. Splitting on the marker keeps this a plain
// string transform with no HTML parsing/sanitization risk. Shared by RichText (a
// paragraph) and BulletList (one bullet at a time) so both parse the same syntax.
export function renderRichTextSegments(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);
    return match ? <strong key={index}>{match[1]}</strong> : <span key={index}>{part}</span>;
  });
}
