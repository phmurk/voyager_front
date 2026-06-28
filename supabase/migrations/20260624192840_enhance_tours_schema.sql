/*
# Enhance tours schema with rich details

1. New columns on `tours`:
- `meals` (text) — meal plan description
- `transport` (text) — transport details
- `guide_language` (text) — guide languages
- `group_size` (text) — group size description
- `difficulty` (text) — tour difficulty
- `best_season` (text) — best time to visit
- `visa_required` (boolean) — visa requirement
- `insurance_included` (boolean) — insurance included
- `free_cancellation` (boolean) — free cancellation
- `instant_confirmation` (boolean) — instant booking
- `amenities` (text[]) — list of amenities
- `highlights` (text[]) — tour highlights
- `faqs` (jsonb) — frequently asked questions
- `gallery` (text[]) — additional gallery images
- `departure_cities` (text[]) — departure cities
- `arrival_info` (text) — arrival information
- `important_notes` (text) — important notes
- `suitable_for` (text[]) — suitable audience
- `languages` (text[]) — available languages

2. Update existing tours with rich data.
*/

ALTER TABLE tours
ADD COLUMN IF NOT EXISTS meals text,
ADD COLUMN IF NOT EXISTS transport text,
ADD COLUMN IF NOT EXISTS guide_language text,
ADD COLUMN IF NOT EXISTS group_size text,
ADD COLUMN IF NOT EXISTS difficulty text,
ADD COLUMN IF NOT EXISTS best_season text,
ADD COLUMN IF NOT EXISTS visa_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS insurance_included boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS free_cancellation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS instant_confirmation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS amenities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS highlights text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS gallery text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS departure_cities text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS arrival_info text,
ADD COLUMN IF NOT EXISTS important_notes text,
ADD COLUMN IF NOT EXISTS suitable_for text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS languages text[] DEFAULT '{}';

-- Update existing tours with rich data
UPDATE tours SET
  meals = 'Завтрак включен, обед и ужин — по желанию',
  transport = 'Перелет чартерным рейсом, трансфер на комфортабельном автобусе',
  guide_language = 'Русский, английский',
  group_size = '15-25 человек',
  difficulty = 'Легкий',
  best_season = 'Май-октябрь',
  visa_required = false,
  insurance_included = true,
  free_cancellation = true,
  instant_confirmation = true,
  amenities = ARRAY['Wi-Fi', 'Бассейн', 'СПА', 'Фитнес-центр', 'Ресторан', 'Бар'],
  highlights = ARRAY['Рисовые террасы Убуда', 'Храм Танах Лот', 'Водопад Тегенунган', 'Пляж Кута', 'Священные обезьяны'],
  faqs = '[{"q":"Нужна ли виза?","a":"Для граждан РФ виза не требуется для пребывания до 30 дней."},{"q":"Какая погода?","a":"Тропический климат, температура +27-32°C круглый год."},{"q":"Что взять с собой?","a":"Легкую одежду, купальник, солнцезащитный крем, репеллент."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва', 'Санкт-Петербург', 'Казань'],
  arrival_info = 'Встреча в аэропорту Нгурах-Рай (DPS). Трансфер до отеля ~30 мин.',
  important_notes = 'Рекомендуется прививка от гепатита А. Не пейте воду из-под крана.',
  suitable_for = ARRAY['Пары', 'Семьи с детьми', 'Компании друзей'],
  languages = ARRAY['Русский', 'Английский', 'Индонезийский']
WHERE title = 'Романтический Бали';

UPDATE tours SET
  meals = 'Завтрак включен',
  transport = 'Прямой перелет, метро и наземный транспорт',
  guide_language = 'Русский, французский',
  group_size = '10-20 человек',
  difficulty = 'Легкий',
  best_season = 'Апрель-октябрь',
  visa_required = true,
  insurance_included = true,
  free_cancellation = true,
  instant_confirmation = false,
  amenities = ARRAY['Wi-Fi', 'Консьерж', 'Ресторан', 'Бизнес-центр'],
  highlights = ARRAY['Эйфелева башня', 'Лувр', 'Собор Парижской Богоматери', 'Монмартр', 'Елисейские поля'],
  faqs = '[{"q":"Нужна ли виза?","a":"Требуется Шенгенская виза."},{"q":"Как добраться?","a":"Прямой перелет из Москвы ~4 часа."},{"q":"Что попробовать?","a":"Круассаны, макаруны, луковый суп, рататуй."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80',
    'https://images.unsplash.com/photo-1520939817895-060bdaf4de1e?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва', 'Санкт-Петербург'],
  arrival_info = 'Встреча в аэропорту Шарль-де-Голль (CDG). Поезд до центра ~45 мин.',
  important_notes = 'Музеи закрыты по вторникам. Эйфелева башня работает до полуночи.',
  suitable_for = ARRAY['Пары', 'Одиночные путешественники', 'Любители искусства'],
  languages = ARRAY['Русский', 'Французский', 'Английский']
WHERE title = 'Париж — город любви';

UPDATE tours SET
  meals = 'Завтрак включен, ужин — традиционная кухня',
  transport = 'Перелет с пересадкой в Дубае, поезд Shinkansen',
  guide_language = 'Русский, японский',
  group_size = '8-15 человек',
  difficulty = 'Средний',
  best_season = 'Март-май, сентябрь-ноябрь',
  visa_required = true,
  insurance_included = true,
  free_cancellation = false,
  instant_confirmation = false,
  amenities = ARRAY['Wi-Fi', 'Онсен (горячие источники)', 'Кимоно-прокат', 'Чайная церемония'],
  highlights = ARRAY['Храм Сэнсо-дзи', 'Сибуя-скрамбл', 'Храм Мэйдзи', 'Рынок Цукидзи', 'Сад камней Рёан-дзи'],
  faqs = '[{"q":"Нужна ли виза?","a":"Требуется японская виза. Оформляем за 2 недели."},{"q":"Какая валюта?","a":"Японская иена (JPY). Банкоматы работают круглосуточно."},{"q":"Есть ли Wi-Fi?","a":"Да, в отелях и большинстве кафе."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва'],
  arrival_info = 'Встреча в аэропорту Нарита (NRT). Поезд до Токио ~1 час.',
  important_notes = 'Снимайте обувь при входе в дома и храмы. Не ешьте на ходу.',
  suitable_for = ARRAY['Культурные путешественники', 'Фотографы', 'Гурманы'],
  languages = ARRAY['Русский', 'Японский', 'Английский']
WHERE title = 'Токио: традиции и технологии';

UPDATE tours SET
  meals = 'Все включено: завтрак, обед, ужин',
  transport = 'Прямой чартерный перелет, трансфер на джипах',
  guide_language = 'Русский, английский, арабский',
  group_size = '20-30 человек',
  difficulty = 'Легкий',
  best_season = 'Ноябрь-март',
  visa_required = false,
  insurance_included = true,
  free_cancellation = true,
  instant_confirmation = true,
  amenities = ARRAY['Wi-Fi', 'Бассейн', 'Аквапарк', 'СПА', 'Конференц-зал', 'Частный пляж'],
  highlights = ARRAY['Бурдж-Халифа', 'Дубай-Молл', 'Сафари в пустыне', 'Пальма Джумейра', 'Фонтан Дубай'],
  faqs = '[{"q":"Нужна ли виза?","a":"Виза по прибытии для граждан РФ."},{"q":"Что надеть?","a":"В торговых центрах — приличная одежда. На пляже — всё что угодно."},{"q":"Алкоголь?","a":"Да, в отелях и лицензированных ресторанах."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80',
    'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань'],
  arrival_info = 'Встреча в аэропорту Дубай (DXB). Трансфер до отеля ~30-45 мин.',
  important_notes = 'Во время Рамадана общественное употребление пищи ограничено.',
  suitable_for = ARRAY['Пары', 'Семьи', 'Шопоголики', 'Любители роскоши'],
  languages = ARRAY['Русский', 'Английский', 'Арабский']
WHERE title = 'Роскошь Дубая';

UPDATE tours SET
  meals = 'Завтрак и ужин включены, обед — на острове',
  transport = 'Перелет через Дубай/Катар, скоростной катер',
  guide_language = 'Русский, английский',
  group_size = 'Максимум 16 человек',
  difficulty = 'Легкий',
  best_season = 'Декабрь-апрель',
  visa_required = false,
  insurance_included = true,
  free_cancellation = true,
  instant_confirmation = true,
  amenities = ARRAY['Wi-Fi', 'Частный пляж', 'Дайвинг-центр', 'СПА', 'Водные виллы', 'Подводный ресторан'],
  highlights = ARRAY['Водные виллы', 'Дайвинг с мантами', 'Закат на пляже', 'Рыбалка на тунца', 'Снорклинг'],
  faqs = '[{"q":"Нужна ли виза?","a":"Бесплатная виза по прибытии на 30 дней."},{"q":"Интернет?","a":"Wi-Fi в отеле, рекомендуем местную SIM."},{"q":"Валюта?","a":"Мальдивская руфия, но принимают доллары."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    'https://images.unsplash.com/photo-1573843981267-be1999ff6082?w=800&q=80',
    'https://images.unsplash.com/photo-1540206351-d6335ef8d8ae?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва'],
  arrival_info = 'Встреча в аэропорту Мале (MLE). Трансфер на катере или гидросамолете 30-60 мин.',
  important_notes = 'Не трогайте кораллы. Запрещен алкоголь на местных островах.',
  suitable_for = ARRAY['Молодожены', 'Пары', 'Дайверы', 'Романтики'],
  languages = ARRAY['Русский', 'Английский', 'Дhiveхи']
WHERE title = 'Мальдивы: рай на земле';

UPDATE tours SET
  meals = 'Завтрак включен',
  transport = 'Прямой перелет, метро и такси',
  guide_language = 'Русский, английский',
  group_size = '15-25 человек',
  difficulty = 'Легкий',
  best_season = 'Апрель-июнь, сентябрь-ноябрь',
  visa_required = true,
  insurance_included = false,
  free_cancellation = true,
  instant_confirmation = true,
  amenities = ARRAY['Wi-Fi', 'Фитнес-центр', 'Ресторан', 'Бизнес-центр', 'Консьерж'],
  highlights = ARRAY['Статуя Свободы', 'Таймс-сквер', 'Центральный парк', 'Бруклинский мост', 'Эмпайр-стейт-билдинг'],
  faqs = '[{"q":"Нужна ли виза?","a":"Требуется американская виза. Собеседование в посольстве."},{"q":"Какое метро брать?","a":"MetroCard на 7 дней — лучший вариант."},{"q":"Чаевые?","a":"15-20% в ресторанах, $1-2 за услуги."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва'],
  arrival_info = 'Встреча в аэропорту JFK. Трансфер до Манхэттена ~45-60 мин.',
  important_notes = 'Не оставляйте вещи без присмотра. Будьте осторожны ночью в некоторых районах.',
  suitable_for = ARRAY['Первые посетители США', 'Шопоголики', 'Любители музеев'],
  languages = ARRAY['Русский', 'Английский', 'Испанский']
WHERE title = 'Нью-Йорк: город мечты';

UPDATE tours SET
  meals = 'Завтрак включен, ужин — традиционная греческая кухня',
  transport = 'Перелет с пересадкой в Афинах, паром',
  guide_language = 'Русский, греческий',
  group_size = '10-18 человек',
  difficulty = 'Легкий',
  best_season = 'Май-октябрь',
  visa_required = true,
  insurance_included = true,
  free_cancellation = true,
  instant_confirmation = false,
  amenities = ARRAY['Wi-Fi', 'Бассейн с видом', 'Винодельня', 'СПА', 'Частный балкон'],
  highlights = ARRAY['Закат в Ие', 'Винодельня Santo Wines', 'Красный пляж', 'Древняя Тира', 'Голубой купол'],
  faqs = '[{"q":"Нужна ли виза?","a":"Шенгенская виза Греции."},{"q":"Как добраться?","a":"Паром из Афин ~5-8 часов или самолет 45 мин."},{"q":"Лучшее время?","a":"Май-июнь и сентябрь — меньше туристов."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
    'https://images.unsplash.com/photo-1613395877344-13d4c79e4df1?w=800&q=80',
    'https://images.unsplash.com/photo-1601581875309-fafbf2a3a2b0?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва', 'Санкт-Петербург'],
  arrival_info = 'Встреча в порту Санторини или аэропорту. Трансфер до отеля ~30 мин.',
  important_notes = 'Много лестниц — не рекомендуется для маломобильных. Солнцезащитный крем обязателен.',
  suitable_for = ARRAY['Молодожены', 'Романтики', 'Фотографы', 'Любители вина'],
  languages = ARRAY['Русский', 'Греческий', 'Английский']
WHERE title = 'Санторини: белоснежные дома';

UPDATE tours SET
  meals = 'Завтрак включен, обед — швейцарская кухня',
  transport = 'Перелет с пересадкой, поезд Glacier Express',
  guide_language = 'Русский, немецкий, французский',
  group_size = '8-15 человек',
  difficulty = 'Средний',
  best_season = 'Июнь-сентябрь, декабрь-март (горные лыжи)',
  visa_required = true,
  insurance_included = true,
  free_cancellation = false,
  instant_confirmation = false,
  amenities = ARRAY['Wi-Fi', 'СПА', 'Бассейн с подогревом', 'Ресторан', 'Лыжная школа'],
  highlights = ARRAY['Маттерхорн', 'Glacier Express', 'Женевское озеро', 'Цюрих', 'Шоколадная фабрика Lindt'],
  faqs = '[{"q":"Нужна ли виза?","a":"Шенгенская виза."},{"q":"Дорого ли?","a":"Да, Швейцария — одна из самых дорогих стран. Бюджет ~$200-300/день."},{"q":"Какая валюта?","a":"Швейцарский франк (CHF). Принимают евро, но сдачу дадут в франках."}]',
  gallery = ARRAY[
    'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80',
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&q=80',
    'https://images.unsplash.com/photo-1506905929516-144896674b52?w=800&q=80'
  ],
  departure_cities = ARRAY['Москва'],
  arrival_info = 'Встреча в аэропорту Цюриха (ZRH). Поезд до Церматта ~3.5 часа.',
  important_notes = 'Очень дорогая страна. Рекомендуем Swiss Travel Pass для экономии.',
  suitable_for = ARRAY['Любители природы', 'Горнолыжники', 'Поездные путешественники'],
  languages = ARRAY['Русский', 'Немецкий', 'Французский', 'Итальянский', 'Английский']
WHERE title = 'Швейцарские Альпы';
