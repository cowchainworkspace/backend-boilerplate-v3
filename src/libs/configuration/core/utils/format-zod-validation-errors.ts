import { ZodIssue } from 'zod';

export const formatZodValidationErrors = (errors: ZodIssue[], configName?: string): string[] => {
  const groupedByTarget = new Map<string, string[]>();

  errors.forEach(error => {
    const targetName = configName || 'UnknownConfig';
    const property = error.path.join('.');
    const constraint = error.message;

    const errorMessage = `  * ${property}:\n${constraint}`;

    if (groupedByTarget.has(targetName)) {
      groupedByTarget.get(targetName)!.push(errorMessage);
    } else {
      groupedByTarget.set(targetName, [errorMessage]);
    }
  });

  const formattedErrors: string[] = [];
  groupedByTarget.forEach((errors, target) => {
    formattedErrors.push(`[${target}]\n${errors.join('\n')}`);
  });

  return formattedErrors;
};
