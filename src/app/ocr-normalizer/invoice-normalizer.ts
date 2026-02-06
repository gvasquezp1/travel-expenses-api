import { FIELD_SYNONYMS } from './constants/invoice-field-map';
import { normalizeKey } from './utils/normalize-key.util';
import { parseValue } from './utils/parse-value.util';
import { NormalizedInvoice } from './dto/normalized-invoice.type';

export function normalizeInvoice(
  rawKeyValues: Record<string, string>
): NormalizedInvoice {
  const result: NormalizedInvoice = {};

  for (const [targetField, aliases] of Object.entries(FIELD_SYNONYMS)) {
    for (const [rawKey, rawValue] of Object.entries(rawKeyValues)) {
      const cleanKey = normalizeKey(rawKey);

      const matched = aliases.some(alias =>
        cleanKey.includes(normalizeKey(alias))
      );

      if (matched) {
        result[targetField as keyof NormalizedInvoice] =
          parseValue(targetField, rawValue);
        break;
      }
    }
  }

  return result;
}