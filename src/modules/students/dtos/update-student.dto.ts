import { z } from 'zod';

export const UpdateStudentByIdDto = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name is too long (max 255 characters)' }),
  course: z
    .string()
    .min(1, { message: 'Course is required' })
    .max(255, { message: 'Course is too long (max 255 characters)' }),
});

export type UpdateStudentByIdDto = z.infer<typeof UpdateStudentByIdDto>;
