// Centralizes the entries.<i>.<field> / entries.<i>.additional_positions.<p>.<field>
// data-field path convention (used for inline content-editing) so every experience
// layout builds these strings the same way instead of hand-typing them per file.
export function entryField(entryIndex: number, field: string): string {
  return `entries.${entryIndex}.${field}`;
}

export function entryBulletField(entryIndex: number, bulletIndex: number): string {
  return `entries.${entryIndex}.bullets.${bulletIndex}`;
}

export function positionField(entryIndex: number, positionIndex: number, field: string): string {
  return `entries.${entryIndex}.additional_positions.${positionIndex}.${field}`;
}

export function positionBulletField(entryIndex: number, positionIndex: number, bulletIndex: number): string {
  return `entries.${entryIndex}.additional_positions.${positionIndex}.bullets.${bulletIndex}`;
}
