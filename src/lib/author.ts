export const AUTHOR = {
  slug: 'lena-bauer',
  name: 'Lena Bauer',
  shortBio: 'Leidenschaftliche Hobbyköchin aus München mit Liebe zur traditionellen deutschen Küche.',
  longBio: 'Lena Bauer ist in einer bayerischen Gastronomiefamilie aufgewachsen und hat von klein auf die traditionelle deutsche Küche geliebt. Nach Jahren des Experimentierens mit Omas Rezepten und modernen Variationen teilt sie auf EasyDeutschKitchen ihre liebsten Gerichte – von herzhaftem Sauerbraten bis hin zu duftenden Lebkuchen. Ihr Ziel: authentische deutsche Aromen zugänglich für jeden Haushalt machen.',
  avatar: '/images/lena-bauer.jpg',
  sameAs: ['https://pinterest.com/lenabauer_kueche'],
} as const;

export type Author = typeof AUTHOR;
