import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import db, { transaction } from './db.js';
import { signToken, requireAuth, requireRole } from './auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

function removeImageFiles(filenames) {
  for (const filename of filenames) {
    fs.unlink(path.join(UPLOADS_DIR, filename), () => {});
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, cb) => {
    const ok = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(
      path.extname(file.originalname).toLowerCase()
    );
    cb(ok ? null : new Error('Дозволени се само слики (jpg, png, webp, gif).'), ok);
  },
});

const PHONE_RE = /^[+]?[\d][\d\s/-]{6,14}$/;

// ===== Автентикација =====

app.post('/api/auth/register', (req, res) => {
  const { email, password, role } = req.body || {};
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Внесете валидна email адреса.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Лозинката мора да има барем 6 карактери.' });
  }
  if (!['client', 'worker'].includes(role)) {
    return res.status(400).json({ error: 'Изберете улога: клиент или мајстор.' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Веќе постои корисник со оваа email адреса.' });
  }
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)')
    .run(email.toLowerCase(), hash, role);
  const user = { id: info.lastInsertRowid, email: email.toLowerCase(), role };
  res.status(201).json({ token: signToken(user), user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Внесете email и лозинка.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get((email || '').toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Погрешен email или лозинка.' });
  }
  const payload = { id: user.id, email: user.email, role: user.role };
  res.json({ token: signToken(payload), user: payload });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ===== Шифрарници =====

app.get('/api/categories', (req, res) => {
  res.json(db.prepare('SELECT * FROM categories ORDER BY id').all());
});

app.get('/api/cities', (req, res) => {
  res.json(db.prepare('SELECT * FROM cities ORDER BY name').all());
});

// ===== Барања од клиенти =====

app.post('/api/requests', requireAuth, requireRole('client'), (req, res) => {
  const {
    category_id, city_id, budget_from, budget_to,
    preferred_date, description, contact_name, contact_phone,
  } = req.body || {};

  if (!category_id || !db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id)) {
    return res.status(400).json({ error: 'Изберете категорија на услуга.' });
  }
  if (!city_id || !db.prepare('SELECT id FROM cities WHERE id = ?').get(city_id)) {
    return res.status(400).json({ error: 'Изберете град/општина.' });
  }
  const from = Number(budget_from);
  if (!from || from <= 0) {
    return res.status(400).json({ error: 'Внесете валиден буџет (во денари).' });
  }
  const to = budget_to ? Number(budget_to) : null;
  if (to !== null && to < from) {
    return res.status(400).json({ error: 'Горната граница на буџетот мора да е поголема од долната.' });
  }
  if (!preferred_date || !/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) {
    return res.status(400).json({ error: 'Изберете датум за извршување на работата.' });
  }
  if (!contact_name || !contact_name.trim()) {
    return res.status(400).json({ error: 'Внесете име за контакт.' });
  }
  if (!contact_phone || !PHONE_RE.test(contact_phone.trim())) {
    return res.status(400).json({ error: 'Внесете валиден телефонски број (пр. 070 123 456).' });
  }

  const info = db
    .prepare(
      `INSERT INTO client_requests
       (user_id, category_id, city_id, budget_from, budget_to, preferred_date, description, contact_name, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id, category_id, city_id, from, to,
      preferred_date, (description || '').trim(), contact_name.trim(), contact_phone.trim()
    );
  res.status(201).json({ id: info.lastInsertRowid });
});

const REQUEST_SELECT = `
  SELECT r.*, c.name AS category_name, ci.name AS city_name
  FROM client_requests r
  JOIN categories c ON c.id = r.category_id
  JOIN cities ci ON ci.id = r.city_id
`;

// Јавна листа на активни барања со филтри (за мајстори – огласна табла)
app.get('/api/requests', requireAuth, (req, res) => {
  const { category_id, city_id } = req.query;
  let sql = REQUEST_SELECT + ` WHERE r.status = 'active'`;
  const params = [];
  if (category_id) { sql += ' AND r.category_id = ?'; params.push(category_id); }
  if (city_id) { sql += ' AND r.city_id = ?'; params.push(city_id); }
  sql += ' ORDER BY r.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

// Барања што одговараат на профилот на најавениот мајстор
app.get('/api/requests/matching', requireAuth, requireRole('worker'), (req, res) => {
  const listing = db
    .prepare('SELECT * FROM worker_listings WHERE user_id = ? AND active = 1')
    .get(req.user.id);
  if (!listing) {
    return res.json({ listing: null, requests: [] });
  }
  const catIds = db
    .prepare('SELECT category_id FROM listing_categories WHERE listing_id = ?')
    .all(listing.id)
    .map((r) => r.category_id);
  if (catIds.length === 0) return res.json({ listing, requests: [] });

  const catPlaceholders = catIds.map(() => '?').join(',');
  let sql = REQUEST_SELECT + ` WHERE r.status = 'active' AND r.category_id IN (${catPlaceholders})`;
  const params = [...catIds];

  if (!listing.all_macedonia) {
    const cityIds = db
      .prepare('SELECT city_id FROM listing_cities WHERE listing_id = ?')
      .all(listing.id)
      .map((r) => r.city_id);
    if (cityIds.length === 0) return res.json({ listing, requests: [] });
    sql += ` AND r.city_id IN (${cityIds.map(() => '?').join(',')})`;
    params.push(...cityIds);
  }
  sql += ' ORDER BY r.created_at DESC';
  res.json({ listing, requests: db.prepare(sql).all(...params) });
});

// Мои барања (клиент)
app.get('/api/requests/mine', requireAuth, requireRole('client'), (req, res) => {
  const rows = db
    .prepare(REQUEST_SELECT + ' WHERE r.user_id = ? ORDER BY r.created_at DESC')
    .all(req.user.id);
  res.json(rows);
});

// Затвори/избриши барање
app.delete('/api/requests/:id', requireAuth, requireRole('client'), (req, res) => {
  const row = db.prepare('SELECT * FROM client_requests WHERE id = ?').get(req.params.id);
  if (!row || row.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Барањето не е пронајдено.' });
  }
  db.prepare(`UPDATE client_requests SET status = 'closed' WHERE id = ?`).run(row.id);
  res.json({ ok: true });
});

// ===== Огласи од мајстори =====

function listingWithDetails(listing) {
  const categories = db
    .prepare(
      `SELECT c.id, c.name FROM listing_categories lc JOIN categories c ON c.id = lc.category_id WHERE lc.listing_id = ?`
    )
    .all(listing.id);
  const cities = db
    .prepare(
      `SELECT ci.id, ci.name FROM listing_cities lc JOIN cities ci ON ci.id = lc.city_id WHERE lc.listing_id = ?`
    )
    .all(listing.id);
  const images = db
    .prepare('SELECT id, filename FROM listing_images WHERE listing_id = ?')
    .all(listing.id)
    .map((img) => ({ id: img.id, url: `/uploads/${img.filename}` }));
  return { ...listing, categories, cities, images };
}

app.post(
  '/api/listings',
  requireAuth,
  requireRole('worker'),
  upload.array('images', 6),
  (req, res) => {
    const {
      display_name, company_name, contact_phone,
      price_type, price, conditions, all_macedonia,
    } = req.body || {};
    let category_ids = req.body.category_ids;
    let city_ids = req.body.city_ids;
    // multipart полињата пристигаат како string или низа
    if (typeof category_ids === 'string') category_ids = JSON.parse(category_ids);
    if (typeof city_ids === 'string') city_ids = JSON.parse(city_ids);

    if (!display_name || !display_name.trim()) {
      return res.status(400).json({ error: 'Внесете име.' });
    }
    if (!contact_phone || !PHONE_RE.test(contact_phone.trim())) {
      return res.status(400).json({ error: 'Внесете валиден телефонски број (пр. 070 123 456).' });
    }
    if (!Array.isArray(category_ids) || category_ids.length === 0) {
      return res.status(400).json({ error: 'Изберете барем една категорија/специјалност.' });
    }
    if (!['hourly', 'per_m2', 'flat'].includes(price_type)) {
      return res.status(400).json({ error: 'Изберете тип на цена (по час, по м², паушално).' });
    }
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) {
      return res.status(400).json({ error: 'Внесете валидна цена (во денари).' });
    }
    const allMk = all_macedonia === '1' || all_macedonia === true || all_macedonia === 'true';
    if (!allMk && (!Array.isArray(city_ids) || city_ids.length === 0)) {
      return res.status(400).json({
        error: 'Изберете градови каде работите или означете „цела Македонија".',
      });
    }

    const result = transaction(() => {
      // еден активен оглас по мајстор – стариот се заменува
      const old = db
        .prepare('SELECT id FROM worker_listings WHERE user_id = ? AND active = 1')
        .get(req.user.id);
      // ако не се прикачени нови слики, ги задржуваме старите наместо да ги изгубиме
      const oldImages = old
        ? db.prepare('SELECT filename FROM listing_images WHERE listing_id = ?').all(old.id).map((r) => r.filename)
        : [];
      const hasNewImages = req.files && req.files.length > 0;
      const keepImages = hasNewImages ? [] : oldImages;
      if (old) {
        db.prepare('DELETE FROM worker_listings WHERE id = ?').run(old.id);
      }
      if (hasNewImages) removeImageFiles(oldImages);
      const info = db
        .prepare(
          `INSERT INTO worker_listings
           (user_id, display_name, company_name, contact_phone, price_type, price, conditions, all_macedonia)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          req.user.id, display_name.trim(), (company_name || '').trim() || null,
          contact_phone.trim(), price_type, priceNum, (conditions || '').trim(), allMk ? 1 : 0
        );
      const listingId = info.lastInsertRowid;
      const insCat = db.prepare('INSERT OR IGNORE INTO listing_categories VALUES (?, ?)');
      for (const cid of category_ids) insCat.run(listingId, cid);
      if (!allMk) {
        const insCity = db.prepare('INSERT OR IGNORE INTO listing_cities VALUES (?, ?)');
        for (const cid of city_ids) insCity.run(listingId, cid);
      }
      const insImg = db.prepare('INSERT INTO listing_images (listing_id, filename) VALUES (?, ?)');
      for (const f of req.files || []) insImg.run(listingId, f.filename);
      for (const filename of keepImages) insImg.run(listingId, filename);
      return listingId;
    });

    res.status(201).json({ id: result });
  }
);

// Листа на мајстори со филтри (за клиенти)
app.get('/api/listings', (req, res) => {
  const { category_id, city_id } = req.query;
  let sql = 'SELECT DISTINCT l.* FROM worker_listings l';
  const params = [];
  const where = ['l.active = 1'];
  if (category_id) {
    sql += ' JOIN listing_categories lc ON lc.listing_id = l.id';
    where.push('lc.category_id = ?');
    params.push(category_id);
  }
  if (city_id) {
    sql += ' LEFT JOIN listing_cities lci ON lci.listing_id = l.id';
    where.push('(l.all_macedonia = 1 OR lci.city_id = ?)');
    params.push(city_id);
  }
  sql += ' WHERE ' + where.join(' AND ') + ' ORDER BY l.created_at DESC';
  const listings = db.prepare(sql).all(...params).map(listingWithDetails);
  res.json(listings);
});

// Мојот оглас (мајстор)
app.get('/api/listings/mine', requireAuth, requireRole('worker'), (req, res) => {
  const listing = db
    .prepare('SELECT * FROM worker_listings WHERE user_id = ? AND active = 1')
    .get(req.user.id);
  res.json(listing ? listingWithDetails(listing) : null);
});

app.delete('/api/listings/:id', requireAuth, requireRole('worker'), (req, res) => {
  const row = db.prepare('SELECT * FROM worker_listings WHERE id = ?').get(req.params.id);
  if (!row || row.user_id !== req.user.id) {
    return res.status(404).json({ error: 'Огласот не е пронајден.' });
  }
  const images = db
    .prepare('SELECT filename FROM listing_images WHERE listing_id = ?')
    .all(row.id)
    .map((r) => r.filename);
  db.prepare('DELETE FROM worker_listings WHERE id = ?').run(row.id);
  removeImageFiles(images);
  res.json({ ok: true });
});

// Обработка на грешки (вкл. multer)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: err.message || 'Настана грешка. Обидете се повторно.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`НајдиМајстор API работи на http://localhost:${PORT}`);
});
