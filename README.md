# НајдиМајстор 🛠️

Платформа за поврзување на клиенти со мајстори/занаетчии во Македонија.

## Технологии

- **Frontend:** React + Vite + Tailwind CSS (v4)
- **Backend:** Node.js + Express
- **База:** SQLite (вграден `node:sqlite` модул — потребен е Node.js 22.5+)
- **Автентикација:** Email/лозинка со JWT токени

## Стартување

Потребни се два терминали:

**Терминал 1 — Backend (порта 3001):**
```bash
cd backend
npm install
npm start
```

**Терминал 2 — Frontend (порта 5173):**
```bash
cd frontend
npm install
npm run dev
```

Отворете **http://localhost:5173** во прелистувач.

## Тест сметки (демо податоци)

| Улога   | Email            | Лозинка  |
|---------|------------------|----------|
| Клиент  | klient@test.mk   | test123  |
| Мајстор | majstor@test.mk  | test123  |

За чист почеток, избришете ги `backend/najdi-majstor.db*` датотеките —
базата се креира и се полни со категории/градови автоматски при старт.

## Структура

```
najdi-majstor/
├── backend/
│   ├── src/
│   │   ├── server.js   # Express API (auth, барања, огласи, слики)
│   │   ├── db.js       # SQLite шема + seed (категории, градови)
│   │   └── auth.js     # JWT middleware
│   └── uploads/        # Прикачени слики (портфолио)
└── frontend/
    └── src/
        ├── App.jsx           # Рутирање + навигација
        ├── AuthContext.jsx   # Сесија (login/register/logout)
        ├── api.js            # Fetch helper со JWT
        └── pages/
            ├── Landing.jsx      # Насловна: „Барам мајстор" / „Јас сум мајстор"
            ├── Register.jsx     # Регистрација со избор на улога
            ├── Login.jsx        # Најава
            ├── NovoBaranje.jsx  # Клиент: формулар за барање
            ├── MoiBaranja.jsx   # Клиент: мои барања (+ затворање)
            ├── Majstori.jsx     # Листа мајстори со филтри (јавна)
            ├── MojOglas.jsx     # Мајстор: креирање оглас + портфолио слики
            └── Baranja.jsx      # Мајстор: огласна табла со барања
```

## API рути

| Метода | Рута                    | Опис                                      |
|--------|-------------------------|-------------------------------------------|
| POST   | /api/auth/register      | Регистрација (email, password, role)       |
| POST   | /api/auth/login         | Најава                                     |
| GET    | /api/categories         | Категории на услуги                        |
| GET    | /api/cities             | Градови/општини                            |
| POST   | /api/requests           | Ново барање (клиент)                       |
| GET    | /api/requests           | Активни барања со филтри (најавени)        |
| GET    | /api/requests/matching  | Барања за профилот на мајсторот            |
| GET    | /api/requests/mine      | Мои барања (клиент)                        |
| DELETE | /api/requests/:id       | Затвори барање (клиент)                    |
| POST   | /api/listings           | Нов оглас, multipart со слики (мајстор)    |
| GET    | /api/listings           | Мајстори со филтри (јавна)                 |
| GET    | /api/listings/mine      | Мојот оглас (мајстор)                      |
| DELETE | /api/listings/:id       | Избриши оглас (мајстор)                    |
