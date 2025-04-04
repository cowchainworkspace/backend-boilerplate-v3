import { z } from 'zod';

export const staticConfigSchema = z.object({
  APP_NAME: z.string().min(3).max(50),
  APP_DESCRIPTION: z.string().min(3).max(150),
});

export type TStaticConfig = z.infer<typeof staticConfigSchema>;
