
-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT,
  address TEXT,
  postcode TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  vat_number TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, business_id)
);

-- Enable RLS on both tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Users can view their business" 
  ON public.businesses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.business_id = businesses.id 
      AND user_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their business" 
  ON public.businesses 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.business_id = businesses.id 
      AND user_profiles.user_id = auth.uid() 
      AND user_profiles.is_admin = true
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create business_logos storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business_logos',
  'business_logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies for business_logos bucket
CREATE POLICY "Public read access for business logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business_logos');

CREATE POLICY "Admins can upload business logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business_logos' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.businesses b ON up.business_id = b.id
      WHERE up.user_id = auth.uid() 
      AND up.is_admin = true
      AND storage.filename(name) LIKE b.id::text || '%'
    )
  );

CREATE POLICY "Admins can update business logos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'business_logos' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.businesses b ON up.business_id = b.id
      WHERE up.user_id = auth.uid() 
      AND up.is_admin = true
      AND storage.filename(name) LIKE b.id::text || '%'
    )
  );

CREATE POLICY "Admins can delete business logos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'business_logos' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.businesses b ON up.business_id = b.id
      WHERE up.user_id = auth.uid() 
      AND up.is_admin = true
      AND storage.filename(name) LIKE b.id::text || '%'
    )
  );
