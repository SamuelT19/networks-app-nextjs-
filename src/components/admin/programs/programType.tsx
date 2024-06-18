import { z } from 'zod';

export const ChannelSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

export const TypeSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

export const CategorySchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1),
});

export const ProgramSchema = z.object({
  id: z.number().positive().optional(),
  title: z.string().min(1),
  duration: z.number().positive(),
  description: z.string().min(1),
  videoUrl: z.string().url(),
  airDate: z.date().optional(),
  isActive: z.boolean().optional(),
  typeId: z.number(),
  categoryId: z.number(),
  channelId: z.number(),
  channel: ChannelSchema.optional(),
  type: TypeSchema.optional(),
  category: CategorySchema.optional(),
});

export type Program = z.infer<typeof ProgramSchema>;

export const validateProgram = (program: Partial<Program>): Record<string, string | undefined> => {
  try {
    ProgramSchema.parse(program);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: Record<string, string | undefined> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          validationErrors[err.path[0]] = err.message;
        }
      });
      return validationErrors;
    }
    return {};
  }
};

