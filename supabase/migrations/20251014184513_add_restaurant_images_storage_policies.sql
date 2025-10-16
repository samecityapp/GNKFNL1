/*
  # Add Storage Policies for Restaurant Images Bucket
  
  ## Changes
  - Add public read policy for restaurant-images bucket
  - Add authenticated upload policy
  - Add authenticated delete policy
  
  ## Security
  - Public can view all restaurant images
  - Only authenticated users can upload
  - Only authenticated users can delete
*/

-- Public read access
CREATE POLICY "Public Access Restaurant Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'restaurant-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated Upload Restaurant Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'restaurant-images');

-- Authenticated users can update
CREATE POLICY "Authenticated Update Restaurant Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'restaurant-images')
WITH CHECK (bucket_id = 'restaurant-images');

-- Authenticated users can delete
CREATE POLICY "Authenticated Delete Restaurant Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'restaurant-images');