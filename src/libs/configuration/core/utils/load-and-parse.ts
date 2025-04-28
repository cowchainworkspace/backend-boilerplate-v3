import { PathOrFileDescriptor, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { z } from 'zod';

import { formatZodValidationErrors } from './format-zod-validation-errors';

/**
 * Load and parse an YAML file with a given schema
 * @param filename Filename of the YAML file
 * @param schema Zod schema to validate the file
 * @returns Parsed content
 */
export const loadAndParse = <T extends z.ZodRawShape>(
  path: PathOrFileDescriptor,
  schema: z.ZodObject<T>,
): z.infer<typeof schema> => {
  const content = load(readFileSync(path, 'utf8'));
  const parsed = schema.safeParse(content);

  if (!parsed.success) {
    const groupedErrors = formatZodValidationErrors(parsed.error.issues, path.toString());
    throw new Error(`Configuration validation errors:\n${groupedErrors.join('\n\n')}`);
  }

  return parsed.data;
};
