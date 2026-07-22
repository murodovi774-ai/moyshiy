-- Create Tables

-- Categories
CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Brands
CREATE TABLE brands (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric NOT NULL,
  old_price numeric,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  stock integer DEFAULT 0 NOT NULL,
  images text[] DEFAULT '{}'::text[],
  is_featured boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_new boolean DEFAULT false,
  has_discount boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Orders
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  comment text,
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending' NOT NULL, -- pending, processing, shipped, delivered, cancelled
  items jsonb NOT NULL, -- array of { product_id, name, price, quantity }
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Banners
CREATE TABLE banners (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text,
  button_text text,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Settings
CREATE TABLE settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'Premium Cleaning',
  phone text,
  telegram_username text,
  instagram_username text,
  address text,
  delivery_price numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Testimonials
CREATE TABLE testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  content text NOT NULL,
  rating integer DEFAULT 5,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Admins (using a custom table for simplicity, or we can use Supabase Auth for actual auth)
-- We will use Supabase Auth and map it to user roles, but creating a simple admin table for ease if preferred
CREATE TABLE admins (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Set up Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public profiles are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON brands FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON banners FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON settings FOR SELECT USING (true);
CREATE POLICY "Public profiles are viewable by everyone." ON testimonials FOR SELECT USING (true);

-- Allow anyone to create an order
CREATE POLICY "Anyone can create an order." ON orders FOR INSERT WITH CHECK (true);

-- Settings needs an initial row
INSERT INTO settings (id, store_name, delivery_price) VALUES (1, 'Premium Cleaning', 10) ON CONFLICT (id) DO NOTHING;
