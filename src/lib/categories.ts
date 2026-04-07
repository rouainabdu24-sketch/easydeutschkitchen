export const CATEGORIES = [
  { slug: 'hauptgerichte', label: 'Hauptgerichte', description: 'Herzhafte Hauptspeisen', emoji: '🍖' },
  { slug: 'suppen',        label: 'Suppen',         description: 'Wärmende Suppen und Eintöpfe', emoji: '🍲' },
  { slug: 'backwaren',     label: 'Backwaren',       description: 'Brot, Brötchen und mehr', emoji: '🥐' },
  { slug: 'desserts',      label: 'Desserts',        description: 'Süße Nachspeisen', emoji: '🍮' },
  { slug: 'fruehstueck',   label: 'Frühstück',       description: 'Guter Start in den Tag', emoji: '🍳' },
  { slug: 'beilagen',      label: 'Beilagen',        description: 'Perfekte Begleiter', emoji: '🥗' },
  { slug: 'snacks',        label: 'Snacks',          description: 'Kleine Häppchen', emoji: '🥨' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getCategoryLabel(slug: string): string {
  return getCategoryBySlug(slug)?.label ?? slug;
}
