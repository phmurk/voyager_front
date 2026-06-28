# VOYAGER — Travel Agency Platform

Полнофункциональное туристическое приложение с React фронтендом и Django REST API бэкендом.

## 🏗️ Архитектура

```
voyager/
├── src/                 # React фронтенд (Vite)
├── django_backend/      # Django REST API
├── .env.example         # Переменные окружения
└── README.md            # Этот файл
```

## 🚀 Быстрый старт

### 1. Клонирование и установка фронтенда

```bash
npm install
# или
pnpm install
```

### 2. Запуск фронтенда

```bash
npm run dev
# или
pnpm dev
```

Приложение будет доступно на `http://localhost:5173`

### 3. Запуск Django бэкенда

см. [django_backend/README.md](./django_backend/README.md)

Бэкенд должен работать на `http://localhost:8000`

## 📋 Требования

- **Frontend**: Node.js 18+, React 19, Vite
- **Backend**: Python 3.9+, Django 4.2+, PostgreSQL

## 🔐 Аутентификация

Система использует **токен-базированную аутентификацию** (Token Auth):

1. Пользователь регистрируется или логинится
2. Получает токен из Django API
3. Токен сохраняется в `localStorage` как `authToken`
4. При каждом защищённом запросе токен отправляется в заголовке:
   ```
   Authorization: Token <your-token>
   ```

### Эндпоинты аутентификации

```
POST   /api/auth/register/  - Регистрация
POST   /api/auth/login/     - Логин
GET    /api/profile/        - Профиль текущего пользователя
PUT    /api/profile/        - Обновить профиль
```

## 🎯 Функции

### Фронтенд (React)

- ✅ Каталог туров с поиском и фильтрацией
- ✅ Деталь тура с маршрутом, отзывами, FAQ
- ✅ Корзина с управлением заказами
- ✅ Профиль пользователя с избранным и активностью
- ✅ Блог с категориями
- ✅ Форум для обсуждений
- ✅ Темная тема (Tailwind CSS)
- ✅ Адаптивный дизайн (мобильный, планшет, десктоп)

### Бэкенд (Django)

- ✅ REST API для всех операций
- ✅ Аутентификация через токены
- ✅ Модели: Tours, Destinations, Blog, Forum, Orders, Favorites
- ✅ Администраторская панель Django
- ✅ PostgreSQL БД
- ✅ CORS поддержка

## 📦 API эндпоинты

### Публичные

```
GET    /api/tours/              - Список туров (с пагинацией)
GET    /api/tours/{id}/         - Деталь тура
GET    /api/tours/hot/          - Горящие туры
GET    /api/tours/search/       - Поиск туров (q=query)
GET    /api/tours/filter/       - Фильтрация туров
GET    /api/destinations/       - Направления
GET    /api/blog/               - Статьи блога
GET    /api/blog/{id}/          - Статья блога
GET    /api/forum-topics/       - Темы форума
GET    /api/forum-topics/{id}/  - Тема форума с ответами
POST   /api/newsletter/         - Подписка на рассылку
```

### Защищённые (требуют токена)

```
GET    /api/profile/            - Профиль + заказы + избранное
PUT    /api/profile/            - Обновить профиль
GET    /api/favorites/          - Избранные туры
POST   /api/favorites/          - Добавить/удалить избранное
GET    /api/orders/             - Мои заказы
POST   /api/orders/             - Создать заказ
GET    /api/forum-activity/     - История активности
POST   /api/forum-topics/{id}/add_reply/ - Ответить в теме
```

## 💾 Структура БД

### Основные таблицы

| Таблица | Назначение |
|---------|-----------|
| `auth_user` | Пользователи системы |
| `tours_destination` | Популярные направления |
| `tours_tour` | Каталог туров |
| `tours_tourimage` | Дополнительные изображения тура |
| `tours_itineraryday` | Маршрут тура по дням |
| `tours_review` | Отзывы о турах |
| `blog_blogpost` | Статьи блога |
| `forum_forumtopic` | Темы обсуждений |
| `forum_forumreply` | Ответы в темах |
| `orders_order` | Заказы |
| `orders_orderitem` | Позиции заказа |
| `tours_favorite` | Избранные туры (M2M) |
| `tours_useractivity` | История активности пользователя |
| `newsletter_newslettersubscriber` | Подписчики |

## 🛠️ Переменные окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

### Frontend переменные

```
VITE_API_URL=http://localhost:8000/api
```

### Backend переменные

```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost/voyager
BETTER_AUTH_SECRET=your-random-secret
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📁 Файловая структура

### Frontend

```
src/
├── pages/              # Страницы (Home, Tours, Blog, Forum, Profile, etc.)
├── components/         # React компоненты (TourCard, Newsletter, etc.)
├── contexts/           # Context API (AuthContext, CartContext)
├── hooks/              # Custom hooks (useScrollAnimation, etc.)
├── lib/
│   ├── api.ts         # API helper функции
│   └── utils.ts       # Утилиты
├── types/             # TypeScript типы
├── styles/            # Глобальные стили
└── App.tsx            # Главный компонент
```

### Backend

```
django_backend/
├── voyager_backend/   # Главное приложение Django
├── tours/            # Приложение туров (Models, Views, Serializers)
├── blog/             # Приложение блога
├── forum/            # Приложение форума
├── orders/           # Приложение заказов
├── manage.py
└── requirements.txt
```

## 🔧 Разработка

### Запуск обоих сервисов

```bash
# Терминал 1 - Frontend
pnpm dev

# Терминал 2 - Backend
cd django_backend
python manage.py runserver
```

### Создание суперпользователя (Django)

```bash
cd django_backend
python manage.py createsuperuser
```

Войти в админку: http://localhost:8000/admin/

### Миграции БД

```bash
cd django_backend
python manage.py makemigrations
python manage.py migrate
```

## 🧪 Тестирование

### Регистрация тестового пользователя

1. Откройте http://localhost:5173/auth
2. Нажмите "Создать аккаунт"
3. Заполните форму и зарегистрируйтесь

### Проверка API

```bash
# Получить список туров
curl http://localhost:8000/api/tours/

# Логин
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Защищённый эндпоинт
curl http://localhost:8000/api/profile/ \
  -H "Authorization: Token YOUR_TOKEN"
```

## 📚 Технологии

### Frontend
- **React 19** - UI фреймворк
- **TypeScript** - Типизация
- **Vite** - Сборка
- **Tailwind CSS** - Стили
- **React Router** - Маршрутизация
- **Lucide React** - Иконки

### Backend
- **Django 4.2+** - Веб-фреймворк
- **Django REST Framework** - API
- **Better Auth** - Аутентификация
- **PostgreSQL** - БД
- **Drizzle ORM** - ORM (опционально)

## 🚀 Деплой

### Heroku / Vercel

1. Задайте переменные окружения в настройках
2. Запустите миграции БД
3. Создайте суперпользователя
4. Разверните приложение

## 📖 Дополнительно

- [Django Backend README](./django_backend/README.md) - Подробнее о бэкенде
- [API документация](./api_docs.md) - Полная API документация (если есть)

## 📝 Лицензия

MIT

## ✉️ Контакты

Для вопросов и предложений откройте Issue на GitHub.
