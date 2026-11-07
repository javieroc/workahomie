import { TransformFnParams } from 'class-transformer';

/** Query-string number: '' / null / undefined become undefined, anything else goes through Number(). */
export const toOptionalNumber = ({ value }: TransformFnParams): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined;
  return typeof value === 'number' ? value : Number(value);
};

/**
 * Multipart forms send a single string when only one value is appended.
 * Wrap strings into arrays and JSON-parse strings that look like a JSON array.
 */
export const toStringArray = ({ value }: TransformFnParams): unknown => {
  if (value === undefined || value === null) return value;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [value];
      } catch {
        return [value];
      }
    }
    return trimmed === '' ? [] : [value];
  }
  return value;
};
