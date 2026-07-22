/* Fallback categories/cities matching backend/src/db.js seed data (same order → same ids).
   Used so the dropdowns work even when no backend API is reachable (e.g. GitHub Pages). */

export const STATIC_CATEGORIES = [
  'Плочкар',
  'Молер',
  'Водоводџија',
  'Електричар',
  'Местач на клими',
  'Столар',
  'Градежник',
  'Кровопокривач',
  'Паркетар',
  'Друго',
].map((name, i) => ({ id: i + 1, name }));

export const STATIC_CITIES = [
  'Скопје', 'Битола', 'Куманово', 'Прилеп', 'Тетово', 'Велес', 'Штип',
  'Охрид', 'Гостивар', 'Струмица', 'Кавадарци', 'Кочани', 'Виница',
  'Струга', 'Кичево', 'Радовиш', 'Гевгелија', 'Дебар', 'Крива Паланка',
  'Свети Николе', 'Неготино', 'Делчево', 'Ресен', 'Пробиштип', 'Берово',
  'Кратово', 'Крушево', 'Македонски Брод', 'Валандово', 'Богданци',
  'Демир Капија', 'Демир Хисар', 'Пехчево', 'Македонска Каменица',
].map((name, i) => ({ id: i + 1, name }));

/* Demo listings shown when /api/listings can't be reached (e.g. GitHub Pages
   with no hosted backend), so the search page has something real-looking to
   display. Replaced automatically the moment a real backend answers. */

function cat(name) {
  return STATIC_CATEGORIES.find((c) => c.name === name);
}
function cityOf(name) {
  return STATIC_CITIES.find((c) => c.name === name);
}

export const MOCK_LISTINGS = [
  {
    id: 1,
    display_name: 'Александар Николовски',
    company_name: 'Николовски Плочки',
    categories: [cat('Плочкар')],
    cities: [cityOf('Скопје'), cityOf('Куманово')],
    all_macedonia: false,
    price: 450,
    price_type: 'per_m2',
    conditions: 'Квалитетна изработка на подни и ѕидни плочки. Над 10 години искуство.',
    images: [],
    contact_phone: '070 123 456',
  },
  {
    id: 2,
    display_name: 'Марија Стојаноска',
    company_name: '',
    categories: [cat('Молер')],
    cities: [cityOf('Скопје')],
    all_macedonia: false,
    price: 180,
    price_type: 'per_m2',
    conditions: 'Молерски работи, гипс картон, декоративни финиши.',
    images: [],
    contact_phone: '071 234 567',
  },
  {
    id: 3,
    display_name: 'Игор Трајковски',
    company_name: '',
    categories: [cat('Водоводџија')],
    cities: [cityOf('Битола'), cityOf('Прилеп')],
    all_macedonia: false,
    price: 400,
    price_type: 'hourly',
    conditions: 'Итни интервенции 24/7. Поправка на цевки, бојлери, чешми.',
    images: [],
    contact_phone: '072 345 678',
  },
  {
    id: 4,
    display_name: 'Дарко Ефтимов',
    company_name: 'ДЕ Електро',
    categories: [cat('Електричар')],
    cities: [],
    all_macedonia: true,
    price: 500,
    price_type: 'hourly',
    conditions: 'Лиценциран електричар. Инсталации, ремонт на разводни табли.',
    images: [],
    contact_phone: '075 456 789',
  },
  {
    id: 5,
    display_name: 'Билјана Ристовска',
    company_name: '',
    categories: [cat('Местач на клими')],
    cities: [cityOf('Тетово'), cityOf('Гостивар')],
    all_macedonia: false,
    price: 2500,
    price_type: 'flat',
    conditions: 'Монтажа и сервис на клима уреди, брзо и професионално.',
    images: [],
    contact_phone: '076 567 890',
  },
  {
    id: 6,
    display_name: 'Стефан Илиевски',
    company_name: 'Илиевски Мебел',
    categories: [cat('Столар')],
    cities: [cityOf('Велес'), cityOf('Штип')],
    all_macedonia: false,
    price: 8000,
    price_type: 'flat',
    conditions: 'Изработка на мебел по нарачка, кујни, гардеробери.',
    images: [],
    contact_phone: '070 678 901',
  },
  {
    id: 7,
    display_name: 'Николче Ангеловски',
    company_name: 'Ангеловски Градба',
    categories: [cat('Градежник')],
    cities: [cityOf('Охрид'), cityOf('Струга')],
    all_macedonia: false,
    price: 450,
    price_type: 'hourly',
    conditions: 'Градежни работи од темел до кров. Тим од 5 работници.',
    images: [],
    contact_phone: '071 789 012',
  },
  {
    id: 8,
    display_name: 'Горан Петрушевски',
    company_name: '',
    categories: [cat('Кровопокривач')],
    cities: [],
    all_macedonia: true,
    price: 300,
    price_type: 'per_m2',
    conditions: 'Реновирање и поправка на покриви, хидроизолација.',
    images: [],
    contact_phone: '072 890 123',
  },
  {
    id: 9,
    display_name: 'Валентина Костовска',
    company_name: '',
    categories: [cat('Паркетар')],
    cities: [cityOf('Скопје')],
    all_macedonia: false,
    price: 400,
    price_type: 'per_m2',
    conditions: 'Поставување и рендисување на паркет и ламинат.',
    images: [],
    contact_phone: '075 901 234',
  },
  {
    id: 10,
    display_name: 'Драган Симоновски',
    company_name: '',
    categories: [cat('Друго')],
    cities: [cityOf('Куманово'), cityOf('Скопје')],
    all_macedonia: false,
    price: 350,
    price_type: 'hourly',
    conditions: 'Ситни поправки во домот, монтажа на мебел, окачување декорации.',
    images: [],
    contact_phone: '076 012 345',
  },
  {
    id: 11,
    display_name: 'Ана Јовановска',
    company_name: 'Јовановска Електро Сервис',
    categories: [cat('Електричар')],
    cities: [cityOf('Струмица'), cityOf('Радовиш'), cityOf('Гевгелија')],
    all_macedonia: false,
    price: 480,
    price_type: 'hourly',
    conditions: 'Брза интервенција во целиот југоисточен регион. Дијагностика и поправка на инсталации.',
    images: [],
    contact_phone: '070 111 222',
  },
  {
    id: 12,
    display_name: 'Владимир Тодоровски',
    company_name: '',
    categories: [cat('Плочкар')],
    cities: [cityOf('Битола')],
    all_macedonia: false,
    price: 6000,
    price_type: 'flat',
    conditions: 'Комплетна изработка на бањи и кујни со плочки.',
    images: [],
    contact_phone: '071 222 333',
  },
];

export function filterMockListings(categoryId, cityId) {
  return MOCK_LISTINGS.filter((l) => {
    const catOk = !categoryId || l.categories.some((c) => String(c.id) === String(categoryId));
    const cityOk =
      !cityId || l.all_macedonia || l.cities.some((c) => String(c.id) === String(cityId));
    return catOk && cityOk;
  });
}
