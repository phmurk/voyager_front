# VOYAGER — Django + PostgreSQL Backend + REST API

Готовые модели, REST API, админка и сериализаторы. Полное решение для React фронтенда.

## 1. Установка

```bash
pip install "django>=4.2" psycopg2-binary djangorestframework django-cors-headers
django-admin startproject voyager_backend
cd voyager_backend
python manage.py startapp tours
```

## 2. Подключение файлов

- Скопируйте `models.py` → `tours/models.py`
- Скопируйте `admin.py` → `tours/admin.py`
- Скопируйте `serializers.py` → `tours/serializers.py`
- Скопируйте `views.py` → `tours/views.py`

## 3. Конфигурация settings.py

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'tours',  # ваше приложение
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # React Vite
    'http://localhost:3000',
    'http://127.0.0.1:5173',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'voyager',
        'USER': 'postgres',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 4. URL конфигурация (urls.py)

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tours.views import *

router = DefaultRouter()
router.register(r'tours', TourViewSet, basename='tour')
router.register(r'destinations', DestinationViewSet, basename='destination')
router.register(r'blog', BlogPostViewSet, basename='blogpost')
router.register(r'forum-topics', ForumTopicViewSet, basename='forumtopic')
router.register(r'forum-replies', ForumReplyViewSet, basename='forumreply')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', LoginView.as_view(), name='login'),
    path('api/profile/', ProfileView.as_view(), name='profile'),
    path('api/favorites/', FavoritesView.as_view(), name='favorites'),
    path('api/forum-activity/', ForumActivityView.as_view(), name='forum-activity'),
    path('api/newsletter/', NewsletterSubscribeView.as_view(), name='newsletter'),
]
```

## 5. Миграции и запуск

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Откройте:
- Админка: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/

## REST API Эндпоинты

### Публичные (без авторизации)
- `GET /api/tours/` — Список туров (с пагинацией)
- `GET /api/tours/{id}/` — Полная информация о туре
- `GET /api/tours/hot/` — Горящие туры
- `GET /api/tours/search/?q=Рим` — Поиск туров
- `GET /api/tours/filter/?country=Италия&difficulty=Средний` — Фильтры
- `GET /api/destinations/` — Направления
- `GET /api/blog/` — Статьи блога
- `GET /api/blog/{id}/` — Статья
- `GET /api/blog/by_category/?category=Советы` — Статьи по категории
- `GET /api/forum-topics/` — Темы обсуждений
- `GET /api/forum-topics/{id}/` — Тема с ответами
- `GET /api/forum-replies/` — Все ответы
- `POST /api/newsletter/` — Подписка на рассылку (`{"email": "..."}`)

### Авторизация
- `POST /api/auth/register/` — Регистрация
  ```json
  {"username": "john", "email": "john@example.com", "password": "123456"}
  ```
  Возвращает: `{"user": {...}, "token": "abc123..."}`

- `POST /api/auth/login/` — Логин
  ```json
  {"username": "john", "password": "123456"}
  ```
  Возвращает: `{"user": {...}, "token": "abc123..."}`

**Сохранить токен в localStorage и отправлять в заголовке:**
```
Authorization: Token abc123...
```

### Защищённые (требуют токена)
- `GET /api/profile/` — Профиль + заказы + избранные туры + активность в форуме
- `PUT /api/profile/` — Обновить профиль (first_name, last_name, avatar, bio)
- `GET /api/orders/` — Мои заказы
- `POST /api/orders/` — Создать новый заказ
- `GET /api/favorites/` — Мои избранные туры
- `POST /api/favorites/` — Добавить/удалить в избранное (`{"tour_id": "uuid"}`)
- `GET /api/forum-activity/` — История активности в форуме
- `POST /api/forum-topics/{id}/add_reply/` — Добавить ответ на тему

## Таблицы БД

| Модель | Назначение |
|---|---|
| `Destination` | Популярные направления |
| `Tour` | Каталог туров (со всеми расширенными полями) |
| `TourImage` | Доп. изображения тура |
| `ItineraryDay` | Маршрут по дням |
| `Review` | Отзывы о турах |
| `BlogPost` | Статьи блога |
| `ForumTopic` | Темы обсуждений |
| `ForumReply` | Ответы в обсуждениях |
| `UserProfile` | Профиль пользователя (статистика, аватар, био) |
| `Favorite` | Избранные туры (M2M) |
| `ForumActivity` | История активности в форуме |
| `NewsletterSubscriber` | Подписчики рассылки |
| `Order` | Заказы |
| `OrderItem` | Позиции заказа |

> Примечание: ArrayField и JSONField работают только на PostgreSQL.
