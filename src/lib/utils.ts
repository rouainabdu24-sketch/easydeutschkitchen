export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function toISO8601Duration(minutes: number): string {
  if (minutes < 60) return `PT${minutes}M`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `PT${h}H${m}M` : `PT${h}H`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const SITE_URL = 'https://easydeutschkitchen.com';
export const SITE_NAME = 'EasyDeutschKitchen';
export const SITE_DESCRIPTION = 'Authentische deutsche Rezepte – einfach erklärt und nachgekocht.';
