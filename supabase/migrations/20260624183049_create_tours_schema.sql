/*
# Create VOYAGER travel agency schema

1. New Tables
- `destinations` — popular travel destinations with images and tour counts
- `tours` — main tours catalog with full details, pricing, ratings
- `tour_images` — additional images for each tour
- `itinerary_days` — day-by-day itinerary for tours
- `reviews` — user reviews for tours
- `blog_posts` — travel blog articles
- `forum_topics` — forum discussion topics
- `forum_replies` — replies to forum topics
- `newsletter_subscribers` — email newsletter subscribers
- `orders` — tour purchase orders
- `order_items` — individual items within orders

2. Security
- Enable RLS on all tables
- Public read access for tours, destinations, blog posts, forum topics/replies
- Authenticated users can create forum topics and replies
- Admin-only write for tours, blog posts, destinations
*/

-- Destinations
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  image text NOT NULL,
  tour_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Tours
CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  duration integer NOT NULL,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  reviews_count integer NOT NULL DEFAULT 0,
  image text NOT NULL,
  location text NOT NULL,
  country text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  hotel text,
  hotel_stars integer,
  included text[] DEFAULT '{}',
  not_included text[] DEFAULT '{}',
  is_hot boolean NOT NULL DEFAULT false,
  discount integer DEFAULT 0,
  max_people integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Tour images
CREATE TABLE IF NOT EXISTS tour_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Itinerary days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text text NOT NULL,
  date text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  author_avatar text,
  date text NOT NULL,
  image text NOT NULL,
  category text NOT NULL,
  read_time integer NOT NULL DEFAULT 5,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Forum topics
CREATE TABLE IF NOT EXISTS forum_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  author_avatar text,
  date text NOT NULL,
  replies_count integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  last_reply text,
  created_at timestamptz DEFAULT now()
);

-- Forum replies
CREATE TABLE IF NOT EXISTS forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
  author text NOT NULL,
  author_avatar text,
  content text NOT NULL,
  date text NOT NULL,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  name text NOT NULL,
  phone text,
  total_amount numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tour_id uuid NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  travel_date date,
  people_count integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read policies for tours and destinations
DROP POLICY IF EXISTS "public_select_destinations" ON destinations;
CREATE POLICY "public_select_destinations" ON destinations FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_tours" ON tours;
CREATE POLICY "public_select_tours" ON tours FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_tour_images" ON tour_images;
CREATE POLICY "public_select_tour_images" ON tour_images FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_itinerary" ON itinerary_days;
CREATE POLICY "public_select_itinerary" ON itinerary_days FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_reviews" ON reviews;
CREATE POLICY "public_select_reviews" ON reviews FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_blog" ON blog_posts;
CREATE POLICY "public_select_blog" ON blog_posts FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_forum_topics" ON forum_topics;
CREATE POLICY "public_select_forum_topics" ON forum_topics FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_select_forum_replies" ON forum_replies;
CREATE POLICY "public_select_forum_replies" ON forum_replies FOR SELECT
TO anon, authenticated USING (true);

-- Authenticated users can create forum topics and replies
DROP POLICY IF EXISTS "auth_insert_forum_topics" ON forum_topics;
CREATE POLICY "auth_insert_forum_topics" ON forum_topics FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_forum_replies" ON forum_replies;
CREATE POLICY "auth_insert_forum_replies" ON forum_replies FOR INSERT
TO authenticated WITH CHECK (true);

-- Newsletter subscribers (public insert)
DROP POLICY IF EXISTS "public_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_insert_newsletter" ON newsletter_subscribers FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "public_select_newsletter" ON newsletter_subscribers FOR SELECT
TO anon, authenticated USING (true);

-- Orders (authenticated users)
DROP POLICY IF EXISTS "auth_select_orders" ON orders;
CREATE POLICY "auth_select_orders" ON orders FOR SELECT
TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "auth_insert_orders" ON orders;
CREATE POLICY "auth_insert_orders" ON orders FOR INSERT
TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "auth_select_order_items" ON order_items;
CREATE POLICY "auth_select_order_items" ON order_items FOR SELECT
TO authenticated USING (
  EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "auth_insert_order_items" ON order_items;
CREATE POLICY "auth_insert_order_items" ON order_items FOR INSERT
TO authenticated WITH CHECK (true);
