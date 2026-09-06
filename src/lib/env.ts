import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default('pk_test_placeholder'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().default('placeholder_anon_key'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional().default('pk_test_placeholder'),
  CLERK_SECRET_KEY: z.string().optional().default('sk_test_placeholder'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default('placeholder_service_role_key'),
  STRIPE_SECRET_KEY: z.string().optional().default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default('whsec_placeholder'),
  RESEND_API_KEY: z.string().optional().default('re_placeholder'),
});

export function getEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.warn('Environment variable validation warning:', result.error.flatten().fieldErrors);
    return envSchema.parse({
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    });
  }
  return result.data;
}

export const env = getEnv();
