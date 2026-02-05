import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
