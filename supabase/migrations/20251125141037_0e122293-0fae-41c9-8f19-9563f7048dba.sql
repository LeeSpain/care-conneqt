-- =====================================================
-- PRODUCT MANAGEMENT SYSTEM - COMPLETE SCHEMA
-- =====================================================

-- 1. CREATE PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('wearable', 'emergency', 'health', 'medication', 'cognitive', 'home-monitoring')),
  monthly_price NUMERIC(10,2),
  image_url TEXT,
  icon_name TEXT,
  color_class TEXT DEFAULT 'text-primary',
  gradient_class TEXT DEFAULT 'from-primary/10 to-primary/5',
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_base_device BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREATE PRODUCT TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.product_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es', 'nl')),
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price_display TEXT,
  features JSONB DEFAULT '[]',
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, language)
);

-- 3. CREATE PRICING PLANS TABLE
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  monthly_price NUMERIC(10,2) NOT NULL,
  devices_included INTEGER DEFAULT 1,
  family_dashboards INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CREATE PLAN TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS public.plan_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.pricing_plans(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es', 'nl')),
  name TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_id, language)
);

-- 5. CREATE STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. ENABLE RLS ON ALL TABLES
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_translations ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES FOR PRODUCTS
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all products"
ON public.products FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 8. CREATE RLS POLICIES FOR PRODUCT TRANSLATIONS
CREATE POLICY "Public can view product translations"
ON public.product_translations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = product_translations.product_id 
  AND products.is_active = true
));

CREATE POLICY "Admins can manage product translations"
ON public.product_translations FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 9. CREATE RLS POLICIES FOR PRICING PLANS
CREATE POLICY "Public can view active plans"
ON public.pricing_plans FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all plans"
ON public.pricing_plans FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 10. CREATE RLS POLICIES FOR PLAN TRANSLATIONS
CREATE POLICY "Public can view plan translations"
ON public.plan_translations FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.pricing_plans 
  WHERE pricing_plans.id = plan_translations.plan_id 
  AND pricing_plans.is_active = true
));

CREATE POLICY "Admins can manage plan translations"
ON public.plan_translations FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- 11. CREATE STORAGE POLICIES FOR PRODUCT IMAGES
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

-- 12. CREATE TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_translations_updated_at BEFORE UPDATE ON public.product_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_translations_updated_at BEFORE UPDATE ON public.plan_translations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED EXISTING PRODUCTS
-- =====================================================

-- Insert Products
INSERT INTO public.products (slug, category, monthly_price, icon_name, is_base_device, sort_order) VALUES
('vivago-watch', 'wearable', 19.99, 'Watch', true, 1),
('sos-pendant', 'emergency', 19.99, 'Radio', true, 2),
('vivago-domi', 'home-monitoring', 29.99, 'Home', false, 3),
('medication-dispenser', 'medication', 34.99, 'Pill', false, 4),
('bbrain-calendar', 'cognitive', 19.99, 'Calendar', false, 5),
('blood-pressure', 'health', 14.99, 'Activity', false, 6),
('glucose-monitor', 'health', 14.99, 'Activity', false, 7),
('weight-scale', 'health', 14.99, 'Scale', false, 8),
('thermometer', 'health', 14.99, 'Thermometer', false, 9);

-- Seed English Translations
INSERT INTO public.product_translations (product_id, language, name, tagline, description, price_display, features, specs)
SELECT 
  p.id,
  'en',
  CASE p.slug
    WHEN 'vivago-watch' THEN 'Vivago Smart Watch'
    WHEN 'sos-pendant' THEN 'SOS Pendant'
    WHEN 'vivago-domi' THEN 'Vivago Domi'
    WHEN 'medication-dispenser' THEN 'Dosell Smart Medication Dispenser'
    WHEN 'bbrain-calendar' THEN 'BBrain Calendar Clock'
    WHEN 'blood-pressure' THEN 'Blood Pressure Monitor'
    WHEN 'glucose-monitor' THEN 'Glucose Monitor'
    WHEN 'weight-scale' THEN 'Smart Weight Scale'
    WHEN 'thermometer' THEN 'Smart Thermometer'
  END,
  CASE p.slug
    WHEN 'vivago-watch' THEN '24/7 activity and wellness monitoring'
    WHEN 'sos-pendant' THEN 'One-touch emergency alert system'
    WHEN 'vivago-domi' THEN 'Home movement and safety sensors'
    WHEN 'medication-dispenser' THEN 'Automated medication reminders'
    WHEN 'bbrain-calendar' THEN 'Memory support with visual reminders'
    WHEN 'blood-pressure' THEN 'Automatic BP readings synced'
    WHEN 'glucose-monitor' THEN 'Continuous glucose monitoring'
    WHEN 'weight-scale' THEN 'Body composition tracking'
    WHEN 'thermometer' THEN 'Contactless temperature monitoring'
  END,
  CASE p.slug
    WHEN 'vivago-watch' THEN '24/7 activity and wellness monitoring with fall detection'
    WHEN 'sos-pendant' THEN 'One-touch emergency alert system with GPS tracking'
    WHEN 'vivago-domi' THEN 'Home movement and safety sensors for comprehensive monitoring'
    WHEN 'medication-dispenser' THEN 'Automated medication reminders with dispensing alerts'
    WHEN 'bbrain-calendar' THEN 'Memory support with visual reminders and daily guidance'
    WHEN 'blood-pressure' THEN 'Automatic BP readings synced to nurse dashboard'
    WHEN 'glucose-monitor' THEN 'Continuous glucose monitoring for diabetic care management'
    WHEN 'weight-scale' THEN 'Body composition tracking with automatic sync'
    WHEN 'thermometer' THEN 'Contactless temperature monitoring with fever alerts'
  END,
  CASE 
    WHEN p.is_base_device THEN 'Included in Base Package'
    ELSE '+€' || p.monthly_price || '/month'
  END,
  '[]'::jsonb,
  '{}'::jsonb
FROM public.products p;

-- =====================================================
-- SEED PRICING PLANS
-- =====================================================

-- Insert Pricing Plans
INSERT INTO public.pricing_plans (slug, monthly_price, devices_included, family_dashboards, is_popular, sort_order) VALUES
('base', 49.99, 1, 0, false, 1),
('independent', 69.99, 2, 2, true, 2),
('chronic', 119.99, 4, -1, false, 3),
('mental', 159.99, 4, -1, false, 4);

-- Seed Plan Translations (English)
INSERT INTO public.plan_translations (plan_id, language, name, description, features)
SELECT 
  pp.id,
  'en',
  CASE pp.slug
    WHEN 'base' THEN 'Base Membership'
    WHEN 'independent' THEN 'Independent Living'
    WHEN 'chronic' THEN 'Chronic Disease Mgmt'
    WHEN 'mental' THEN 'Mental Health & Wellness'
  END,
  CASE pp.slug
    WHEN 'base' THEN 'Essential care for independent living'
    WHEN 'independent' THEN 'Enhanced monitoring and emergency response'
    WHEN 'chronic' THEN 'Comprehensive health monitoring'
    WHEN 'mental' THEN 'Complete support with therapy access'
  END,
  CASE pp.slug
    WHEN 'base' THEN '["1 Device (Vivago Watch or SOS Pendant)", "AI Guardian (EN/ES/NL)", "Member Dashboard", "Monthly Nurse Check-in", "24/7 Emergency Call Center", "Clinical notes & family notifications"]'
    WHEN 'independent' THEN '["Everything in Base Membership", "2 Devices included", "Weekly Nurse Check-ins", "Priority Emergency Response", "Advanced Activity Monitoring", "Family Dashboard (2 users)"]'
    WHEN 'chronic' THEN '["Everything in Independent Living", "4 Devices (health monitoring suite)", "Daily Nurse Monitoring", "Medication Management", "Vital Signs Tracking", "Care Coordinator", "Unlimited Family Dashboards"]'
    WHEN 'mental' THEN '["Everything in Chronic Disease Mgmt", "Weekly Therapy Sessions", "Mental Health Specialist", "Social Wellness Activities", "Mood & Anxiety Tracking", "Crisis Intervention Support", "Caregiver Support Programs"]'
  END::jsonb
FROM public.pricing_plans pp;