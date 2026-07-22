-- Auto seed standard categories for TozaUy.uz
INSERT INTO categories (name, slug)
VALUES 
  ('Kir yuvish', 'kir-yuvish'),
  ('Tozalash', 'tozalash'),
  ('Yumshatgich', 'yumshatgich'),
  ('Oshxona', 'oshxona'),
  ('Maishiy Kimyo', 'maishiy-kimyo')
ON CONFLICT (slug) DO NOTHING;
