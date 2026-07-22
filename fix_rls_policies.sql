-- Enable Full Access (INSERT, UPDATE, DELETE, SELECT) for all admin tables

-- 1. Products
DROP POLICY IF EXISTS "Allow all operations for products" ON products;
CREATE POLICY "Allow all operations for products" ON products FOR ALL USING (true) WITH CHECK (true);

-- 2. Categories
DROP POLICY IF EXISTS "Allow all operations for categories" ON categories;
CREATE POLICY "Allow all operations for categories" ON categories FOR ALL USING (true) WITH CHECK (true);

-- 3. Brands
DROP POLICY IF EXISTS "Allow all operations for brands" ON brands;
CREATE POLICY "Allow all operations for brands" ON brands FOR ALL USING (true) WITH CHECK (true);

-- 4. Banners
DROP POLICY IF EXISTS "Allow all operations for banners" ON banners;
CREATE POLICY "Allow all operations for banners" ON banners FOR ALL USING (true) WITH CHECK (true);

-- 5. Settings
DROP POLICY IF EXISTS "Allow all operations for settings" ON settings;
CREATE POLICY "Allow all operations for settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Testimonials
DROP POLICY IF EXISTS "Allow all operations for testimonials" ON testimonials;
CREATE POLICY "Allow all operations for testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);

-- 7. Orders
DROP POLICY IF EXISTS "Allow all operations for orders" ON orders;
CREATE POLICY "Allow all operations for orders" ON orders FOR ALL USING (true) WITH CHECK (true);

-- 8. Storage bucket policies for 'images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Storage Access" ON storage.objects;
CREATE POLICY "Public Storage Access" ON storage.objects FOR ALL USING (true) WITH CHECK (true);

-- 9. Make sure all products are set to active
UPDATE products SET is_active = true WHERE is_active IS NULL OR is_active = false;
