export function parseValue(field: string, value: string): any {
  if (!value) return undefined;

  if (['total', 'subtotal', 'tax', 'tip'].includes(field)) {
    const cleaned = value
      .replace(/[^\d.,]/g, '')
      .trim();

    return cleaned.length ? cleaned : undefined;
  }

  return value.trim();
}