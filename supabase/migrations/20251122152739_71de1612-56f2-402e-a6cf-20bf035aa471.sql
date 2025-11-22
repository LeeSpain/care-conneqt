-- Change default language to Dutch for all new profiles
ALTER TABLE public.profiles 
ALTER COLUMN language SET DEFAULT 'nl';

-- Update existing profiles that have English to Dutch
UPDATE public.profiles 
SET language = 'nl' 
WHERE language = 'en';

-- Update the handle_new_user trigger to capture language from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, language)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'nl')
  );
  RETURN NEW;
END;
$$;