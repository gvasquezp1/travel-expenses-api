import { normalizeInvoice } from '../ocr-normalizer/invoice-normalizer';

export function parseTextractKeyValues(rawKeyValues: Record<string, string>) {
  const normalized = normalizeInvoice(rawKeyValues);

  return {
    normalized,
    raw: rawKeyValues
  };
}