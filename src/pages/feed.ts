import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const recipes = await getCollection('recipes', ({ data }) => !data.draft);

  const sorted = recipes.sort(
    (a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf()
  );

  return rss({
    title: 'EasyDeutschKitchen – Deutsche Rezepte',
    description: 'Einfache und authentische deutsche Rezepte – von Sauerbraten bis Brezel.',
    site: context.site!,
    items: sorted.map((recipe) => {
      const imageUrl = new URL(recipe.data.heroImage, context.site!).toString();

      return {
        title: recipe.data.title,
        description: recipe.data.description,
        pubDate: new Date(recipe.data.pubDate),
        link: `/rezepte/${recipe.id}/`,
        enclosure: {
          url: imageUrl,
          length: 0,
          type: 'image/jpeg',
        },
        customData: `<media:content url="${imageUrl}" medium="image"/>`,
      };
    }),
    customData: `<language>de</language>`,
    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },
  });
}
