import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/recipes' }),
  schema: z.object({
    title:        z.string().min(1).max(100),
    description:  z.string().min(50).max(300),
    pubDate:      z.coerce.date(),
    updatedDate:  z.coerce.date().optional(),
    category:     z.enum(['hauptgerichte', 'suppen', 'backwaren', 'desserts', 'fruehstueck', 'beilagen', 'snacks']),
    tags:         z.array(z.string()).min(1).max(15),
    heroImage:    z.string(),
    heroImageAlt: z.string(),
    midImage:     z.string().optional(),
    midImageAlt:  z.string().optional(),
    prepTime:     z.number().int().positive(),
    cookTime:     z.number().int().positive(),
    servings:     z.number().int().positive(),
    difficulty:   z.enum(['einfach', 'mittel', 'schwer']),
    ingredients:  z.array(z.object({
      name:   z.string(),
      amount: z.number().optional(),
      unit:   z.string().optional(),
      note:   z.string().optional(),
    })).min(1),
    nutrition: z.object({
      calories: z.number().int().nonnegative(),
      protein:  z.number().nonnegative(),
      fat:      z.number().nonnegative(),
      carbs:    z.number().nonnegative(),
      fiber:    z.number().nonnegative().optional(),
      sugar:    z.number().nonnegative().optional(),
      sodium:   z.number().nonnegative().optional(),
    }),
    faq:      z.array(z.object({
      question: z.string(),
      answer:   z.string(),
    })).optional().default([]),
    author:   z.string().default('lena-bauer'),
    featured: z.boolean().default(false),
    draft:    z.boolean().default(false),
  }),
});

export const collections = { recipes };
