-- Drop old constraint and add new one with 'service' category
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category = ANY (ARRAY['wearable', 'emergency', 'health', 'medication', 'cognitive', 'home-monitoring', 'service']));

-- Add product_type column to differentiate devices from services
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'device';

-- Update existing products to be devices
UPDATE products SET product_type = 'device' WHERE product_type IS NULL;

-- Insert new service products
INSERT INTO products (slug, category, monthly_price, icon_name, color_class, gradient_class, is_active, is_popular, is_base_device, sort_order, product_type)
VALUES 
  ('family-dashboard', 'service', 2.99, 'Users', 'text-blue-500', 'from-blue-500/20 to-blue-600/10', true, true, false, 10, 'service'),
  ('extra-nurse-support', 'service', 9.99, 'HeartPulse', 'text-rose-500', 'from-rose-500/20 to-rose-600/10', true, false, false, 11, 'service'),
  ('priority-emergency', 'service', 14.99, 'Shield', 'text-amber-500', 'from-amber-500/20 to-amber-600/10', true, true, false, 12, 'service'),
  ('care-coordinator', 'service', 29.99, 'UserCheck', 'text-purple-500', 'from-purple-500/20 to-purple-600/10', true, false, false, 13, 'service'),
  ('medication-management-service', 'service', 19.99, 'Pill', 'text-emerald-500', 'from-emerald-500/20 to-emerald-600/10', true, false, false, 14, 'service');

-- Get IDs for new service products and insert translations
DO $$
DECLARE
  family_dashboard_id UUID;
  nurse_support_id UUID;
  priority_emergency_id UUID;
  care_coordinator_id UUID;
  medication_mgmt_id UUID;
BEGIN
  SELECT id INTO family_dashboard_id FROM products WHERE slug = 'family-dashboard';
  SELECT id INTO nurse_support_id FROM products WHERE slug = 'extra-nurse-support';
  SELECT id INTO priority_emergency_id FROM products WHERE slug = 'priority-emergency';
  SELECT id INTO care_coordinator_id FROM products WHERE slug = 'care-coordinator';
  SELECT id INTO medication_mgmt_id FROM products WHERE slug = 'medication-management-service';

  -- English translations
  INSERT INTO product_translations (product_id, language, name, tagline, description, price_display, features, specs)
  VALUES 
    (family_dashboard_id, 'en', 'Family Dashboard Access', 'Real-time monitoring for family members', 'Allow family members to view health data, alerts, and activity through their own secure dashboard', '€2.99/mo', '["View live health metrics", "Receive instant alerts", "Access activity history", "Secure family portal"]', '{}'),
    (nurse_support_id, 'en', 'Extra Nurse Support', 'Additional weekly nurse check-ins', 'Receive extra weekly video or phone consultations with our qualified nursing team', '€9.99/mo', '["Weekly nurse check-ins", "Priority scheduling", "Extended consultation time", "Care plan updates"]', '{}'),
    (priority_emergency_id, 'en', 'Priority Emergency Response', 'Dedicated 24/7 priority line', 'Jump the queue with dedicated emergency response line and faster dispatch times', '€14.99/mo', '["Dedicated priority line", "Faster response times", "Direct nurse access", "Emergency protocols"]', '{}'),
    (care_coordinator_id, 'en', 'Personal Care Coordinator', 'Dedicated care management support', 'Your own dedicated care coordinator to manage appointments, coordinate services, and advocate for your care needs', '€29.99/mo', '["Dedicated coordinator", "Appointment management", "Service coordination", "Care advocacy"]', '{}'),
    (medication_mgmt_id, 'en', 'Medication Management Service', 'Nurse-supervised medication support', 'Professional medication review, reminder optimization, and nurse oversight for complex medication regimens', '€19.99/mo', '["Medication review", "Schedule optimization", "Interaction checks", "Nurse oversight"]', '{}');

  -- Dutch translations
  INSERT INTO product_translations (product_id, language, name, tagline, description, price_display, features, specs)
  VALUES 
    (family_dashboard_id, 'nl', 'Familie Dashboard Toegang', 'Real-time monitoring voor familieleden', 'Sta familieleden toe om gezondheidsgegevens, waarschuwingen en activiteit te bekijken via hun eigen beveiligde dashboard', '€2,99/mnd', '["Bekijk live gezondheidsmetrieken", "Ontvang directe waarschuwingen", "Toegang tot activiteitengeschiedenis", "Beveiligd familieportaal"]', '{}'),
    (nurse_support_id, 'nl', 'Extra Verpleegkundige Ondersteuning', 'Extra wekelijkse verpleegkundige check-ins', 'Ontvang extra wekelijkse video- of telefonische consulten met ons gekwalificeerde verpleegkundig team', '€9,99/mnd', '["Wekelijkse verpleegkundige check-ins", "Prioriteitsplanning", "Verlengde consulttijd", "Zorgplan updates"]', '{}'),
    (priority_emergency_id, 'nl', 'Prioriteit Noodrespons', 'Speciale 24/7 prioriteitslijn', 'Sla de wachtrij over met een speciale noodresponslijn en snellere dispatchtijden', '€14,99/mnd', '["Speciale prioriteitslijn", "Snellere responstijden", "Directe verpleegkundige toegang", "Noodprotocollen"]', '{}'),
    (care_coordinator_id, 'nl', 'Persoonlijke Zorgcoördinator', 'Toegewijde zorgbeheer ondersteuning', 'Uw eigen toegewijde zorgcoördinator om afspraken te beheren, diensten te coördineren en uw zorgbehoeften te behartigen', '€29,99/mnd', '["Toegewijde coördinator", "Afsprakenbeheer", "Diensten coördinatie", "Zorgbelangen"]', '{}'),
    (medication_mgmt_id, 'nl', 'Medicatiebeheer Dienst', 'Door verpleegkundige gesuperviseerde medicatie ondersteuning', 'Professionele medicatiebeoordeling, herinnering optimalisatie en verpleegkundig toezicht voor complexe medicatieschemas', '€19,99/mnd', '["Medicatiebeoordeling", "Schema optimalisatie", "Interactiecontroles", "Verpleegkundig toezicht"]', '{}');

  -- Spanish translations
  INSERT INTO product_translations (product_id, language, name, tagline, description, price_display, features, specs)
  VALUES 
    (family_dashboard_id, 'es', 'Acceso Panel Familiar', 'Monitoreo en tiempo real para familiares', 'Permita que los miembros de la familia vean datos de salud, alertas y actividad a través de su propio panel seguro', '€2,99/mes', '["Ver métricas de salud en vivo", "Recibir alertas instantáneas", "Acceso al historial de actividad", "Portal familiar seguro"]', '{}'),
    (nurse_support_id, 'es', 'Soporte Extra de Enfermería', 'Check-ins semanales adicionales con enfermería', 'Reciba consultas adicionales semanales por video o teléfono con nuestro equipo de enfermería calificado', '€9,99/mes', '["Check-ins semanales de enfermería", "Programación prioritaria", "Tiempo de consulta extendido", "Actualizaciones del plan de cuidado"]', '{}'),
    (priority_emergency_id, 'es', 'Respuesta de Emergencia Prioritaria', 'Línea prioritaria dedicada 24/7', 'Salte la cola con una línea de respuesta de emergencia dedicada y tiempos de despacho más rápidos', '€14,99/mes', '["Línea prioritaria dedicada", "Tiempos de respuesta más rápidos", "Acceso directo a enfermería", "Protocolos de emergencia"]', '{}'),
    (care_coordinator_id, 'es', 'Coordinador de Cuidado Personal', 'Soporte dedicado de gestión de cuidados', 'Su propio coordinador de cuidados dedicado para gestionar citas, coordinar servicios y abogar por sus necesidades de cuidado', '€29,99/mes', '["Coordinador dedicado", "Gestión de citas", "Coordinación de servicios", "Defensa del cuidado"]', '{}'),
    (medication_mgmt_id, 'es', 'Servicio de Gestión de Medicamentos', 'Soporte de medicación supervisado por enfermería', 'Revisión profesional de medicamentos, optimización de recordatorios y supervisión de enfermería para regímenes de medicación complejos', '€19,99/mes', '["Revisión de medicamentos", "Optimización de horarios", "Verificación de interacciones", "Supervisión de enfermería"]', '{}');
END $$;