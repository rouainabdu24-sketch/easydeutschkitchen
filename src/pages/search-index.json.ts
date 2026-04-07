import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const recipes = await getCollection('recipes', r => !r.data.draft);
  const index = recipes.map(r => ({
    slug: r.id,
    title: r.data.title,
    description: r.data.description,
    category: r.data.category,
    tags: r.data.tags,
    heroImage: r.data.heroImage,
    heroImageAlt: r.data.heroImageAlt,
    prepTime: r.data.prepTime,
    cookTime: r.data.cookTime,
    difficulty: r.data.difficulty,
  }));
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
