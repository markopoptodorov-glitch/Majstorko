import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, '..', 'najdi-majstor.db'));

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// Замена за transaction() хелперот од better-sqlite3
export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('client', 'worker')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cities (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS client_requests (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id),
  category_id    INTEGER NOT NULL REFERENCES categories(id),
  city_id        INTEGER NOT NULL REFERENCES cities(id),
  budget_from    INTEGER NOT NULL,
  budget_to      INTEGER,
  preferred_date TEXT NOT NULL,
  description    TEXT,
  contact_name   TEXT NOT NULL,
  contact_phone  TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS worker_listings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id),
  display_name  TEXT NOT NULL,
  company_name  TEXT,
  contact_phone TEXT NOT NULL,
  price_type    TEXT NOT NULL CHECK (price_type IN ('hourly', 'per_m2', 'flat')),
  price         INTEGER NOT NULL,
  conditions    TEXT,
  all_macedonia INTEGER NOT NULL DEFAULT 0,
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS listing_categories (
  listing_id  INTEGER NOT NULL REFERENCES worker_listings(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  PRIMARY KEY (listing_id, category_id)
);

CREATE TABLE IF NOT EXISTS listing_cities (
  listing_id INTEGER NOT NULL REFERENCES worker_listings(id) ON DELETE CASCADE,
  city_id    INTEGER NOT NULL REFERENCES cities(id),
  PRIMARY KEY (listing_id, city_id)
);

CREATE TABLE IF NOT EXISTS listing_images (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES worker_listings(id) ON DELETE CASCADE,
  filename   TEXT NOT NULL
);
`);

const CATEGORIES = [
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
];

const CITIES = [
  'Скопје', 'Битола', 'Куманово', 'Прилеп', 'Тетово', 'Велес', 'Штип',
  'Охрид', 'Гостивар', 'Струмица', 'Кавадарци', 'Кочани', 'Виница',
  'Струга', 'Кичево', 'Радовиш', 'Гевгелија', 'Дебар', 'Крива Паланка',
  'Свети Николе', 'Неготино', 'Делчево', 'Ресен', 'Пробиштип', 'Берово',
  'Кратово', 'Крушево', 'Македонски Брод', 'Валандово', 'Богданци',
  'Демир Капија', 'Демир Хисар', 'Пехчево', 'Македонска Каменица',
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
const insertCity = db.prepare('INSERT OR IGNORE INTO cities (name) VALUES (?)');

transaction(() => {
  for (const c of CATEGORIES) insertCategory.run(c);
  for (const c of CITIES) insertCity.run(c);
});

export default db;
