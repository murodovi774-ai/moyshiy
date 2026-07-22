-- Storage Bucket Policies for "images"

-- 1. Allow public read access to all files in the "images" bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'images' );

-- 2. Allow authenticated users (admins) to insert files
DROP POLICY IF EXISTS "Authenticated users can insert" ON storage.objects;
CREATE POLICY "Authenticated users can insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- 3. Allow authenticated users to update their files
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );

-- 4. Allow authenticated users to delete files
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'images' AND auth.role() = 'authenticated' );
