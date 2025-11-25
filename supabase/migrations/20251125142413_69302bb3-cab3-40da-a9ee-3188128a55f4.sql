-- Update products with missing icon_name, color_class, and gradient_class
UPDATE products SET 
  icon_name = 'Watch', 
  color_class = 'text-secondary',
  gradient_class = 'from-secondary/10 to-secondary/5'
WHERE slug = 'vivago-watch';

UPDATE products SET 
  icon_name = 'Radio', 
  color_class = 'text-red-500',
  gradient_class = 'from-red-500/10 to-red-500/5'
WHERE slug = 'sos-pendant';

UPDATE products SET 
  icon_name = 'Home', 
  color_class = 'text-blue-500',
  gradient_class = 'from-blue-500/10 to-blue-500/5'
WHERE slug = 'vivago-domi';

UPDATE products SET 
  icon_name = 'Pill', 
  color_class = 'text-purple-500',
  gradient_class = 'from-purple-500/10 to-purple-500/5'
WHERE slug = 'dosell-dispenser';

UPDATE products SET 
  icon_name = 'Calendar', 
  color_class = 'text-orange-500',
  gradient_class = 'from-orange-500/10 to-orange-500/5'
WHERE slug = 'bbrain-calendar';

UPDATE products SET 
  icon_name = 'Activity', 
  color_class = 'text-green-500',
  gradient_class = 'from-green-500/10 to-green-500/5'
WHERE slug = 'health-monitors';

UPDATE products SET 
  icon_name = 'Scale', 
  color_class = 'text-teal-500',
  gradient_class = 'from-teal-500/10 to-teal-500/5'
WHERE slug = 'smart-scale';

UPDATE products SET 
  icon_name = 'Thermometer', 
  color_class = 'text-pink-500',
  gradient_class = 'from-pink-500/10 to-pink-500/5'
WHERE slug = 'smart-thermometer';

-- Add Spanish translations for products
INSERT INTO product_translations (product_id, language, name, tagline, description, price_display, features, specs)
SELECT 
  id,
  'es',
  CASE slug
    WHEN 'vivago-watch' THEN 'Reloj Inteligente Vivago'
    WHEN 'sos-pendant' THEN 'Colgante SOS'
    WHEN 'vivago-domi' THEN 'Sensor Vivago Domi'
    WHEN 'dosell-dispenser' THEN 'Dispensador Inteligente Dosell'
    WHEN 'bbrain-calendar' THEN 'Reloj Calendario BBrain'
    WHEN 'health-monitors' THEN 'Monitores de Salud'
    WHEN 'smart-scale' THEN 'Báscula Inteligente'
    WHEN 'smart-thermometer' THEN 'Termómetro Inteligente'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN 'Monitoreo de bienestar 24/7 con detección de caídas'
    WHEN 'sos-pendant' THEN 'Botón de emergencia personal discreto'
    WHEN 'vivago-domi' THEN 'Monitoreo ambiental y de actividad'
    WHEN 'dosell-dispenser' THEN 'Gestión automatizada de medicamentos'
    WHEN 'bbrain-calendar' THEN 'Reloj con recordatorios cognitivos'
    WHEN 'health-monitors' THEN 'Dispositivos de monitoreo de signos vitales'
    WHEN 'smart-scale' THEN 'Seguimiento de peso y composición corporal'
    WHEN 'smart-thermometer' THEN 'Monitoreo de temperatura sin contacto'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN 'El Reloj Inteligente Vivago proporciona monitoreo continuo de salud con detección automática de caídas y alertas SOS. Monitorea patrones de actividad, calidad del sueño y bienestar general mientras mantiene la independencia.'
    WHEN 'sos-pendant' THEN 'Lleve tranquilidad con este discreto botón de emergencia personal. Una simple pulsación alerta instantáneamente a su equipo de cuidado y familia. Resistente al agua y de batería de larga duración.'
    WHEN 'vivago-domi' THEN 'El sensor Vivago Domi monitorea la actividad en el hogar y las condiciones ambientales. Detecta patrones de actividad inusuales y proporciona información sobre rutinas diarias sin cámaras.'
    WHEN 'dosell-dispenser' THEN 'El Dispensador Inteligente Dosell automatiza la gestión de medicamentos con recordatorios y dispensación programada. Asegura el cumplimiento de la medicación y alerta a los cuidadores sobre dosis perdidas.'
    WHEN 'bbrain-calendar' THEN 'El Reloj Calendario BBrain combina un reloj claro y fácil de leer con recordatorios de tareas y citas. Diseñado para apoyar la función cognitiva e independencia.'
    WHEN 'health-monitors' THEN 'Monitores de grado médico para presión arterial, frecuencia cardíaca, oxígeno en sangre y más. Datos sincronizados automáticamente con su equipo de cuidado para monitoreo proactivo de salud.'
    WHEN 'smart-scale' THEN 'Siga tendencias de peso, IMC y composición corporal. Comparta automáticamente datos con proveedores de salud para detectar tempranamente cambios que podrían indicar problemas de salud.'
    WHEN 'smart-thermometer' THEN 'Medición de temperatura sin contacto con resultados instantáneos. Sigue tendencias de temperatura y alerta a cuidadores de lecturas anormales para intervención temprana.'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '€89/mes'
    WHEN 'sos-pendant' THEN '€29/mes'
    WHEN 'vivago-domi' THEN '€49/mes'
    WHEN 'dosell-dispenser' THEN '€69/mes'
    WHEN 'bbrain-calendar' THEN '€39/mes'
    WHEN 'health-monitors' THEN '€59/mes'
    WHEN 'smart-scale' THEN '€24/mes'
    WHEN 'smart-thermometer' THEN '€19/mes'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '["Monitoreo de bienestar 24/7", "Detección automática de caídas", "Alertas SOS", "Seguimiento de actividad y sueño", "Resistente al agua", "Duración de batería de 7 días"]'::jsonb
    WHEN 'sos-pendant' THEN '["Alerta de emergencia con un botón", "Diseño discreto y portátil", "Resistente al agua", "Batería de larga duración (hasta 3 años)", "Alcance de hasta 300m"]'::jsonb
    WHEN 'vivago-domi' THEN '["Monitoreo de actividad sin cámara", "Seguimiento de patrones en el hogar", "Detección de anomalías", "Monitoreo de temperatura ambiental", "Inalámbrico y discreto"]'::jsonb
    WHEN 'dosell-dispenser' THEN '["Dispensación automática de medicamentos", "Recordatorios programables", "Alertas de adherencia", "Compartimentos seguros", "Notificaciones al cuidador"]'::jsonb
    WHEN 'bbrain-calendar' THEN '["Pantalla clara de hora/fecha", "Recordatorios visuales y de audio", "Soporte cognitivo", "Sin suscripción requerida", "Fácil de usar"]'::jsonb
    WHEN 'health-monitors' THEN '["Dispositivos de grado médico", "Sincronización automática de datos", "Múltiples métricas de salud", "Monitoreo remoto", "Seguimiento de tendencias"]'::jsonb
    WHEN 'smart-scale' THEN '["Análisis de composición corporal", "Múltiples perfiles de usuario", "Integración con app", "Seguimiento de tendencias", "Compartir datos con profesionales de la salud"]'::jsonb
    WHEN 'smart-thermometer' THEN '["Medición sin contacto", "Resultados instantáneos", "Seguimiento de historial", "Alertas de fiebre", "Higiénico y seguro"]'::jsonb
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '{"batteryLife": "Hasta 7 días", "connectivity": "Bluetooth, Celular", "waterResistance": "IP67", "weight": "45g"}'::jsonb
    WHEN 'sos-pendant' THEN '{"batteryLife": "Hasta 3 años", "range": "300m", "waterResistance": "IPX7", "weight": "28g"}'::jsonb
    WHEN 'vivago-domi' THEN '{"connectivity": "WiFi", "sensors": "Movimiento, Temperatura", "dimensions": "12x8x3cm", "powerSource": "Cable (backup de batería)"}'::jsonb
    WHEN 'dosell-dispenser' THEN '{"capacity": "28 compartimentos", "connectivity": "WiFi", "dimensions": "20x15x10cm", "powerSource": "Cable (backup de batería)"}'::jsonb
    WHEN 'bbrain-calendar' THEN '{"displaySize": "8 pulgadas", "connectivity": "WiFi (opcional)", "dimensions": "22x17x2cm", "powerSource": "Cable"}'::jsonb
    WHEN 'health-monitors' THEN '{"metrics": "PA, FC, SpO2, Glucosa", "connectivity": "Bluetooth", "certification": "CE Médico", "storage": "Hasta 200 lecturas"}'::jsonb
    WHEN 'smart-scale' THEN '{"maxWeight": "180kg", "connectivity": "Bluetooth, WiFi", "metrics": "8+ puntos de datos", "users": "Hasta 8 perfiles"}'::jsonb
    WHEN 'smart-thermometer' THEN '{"accuracy": "±0.2°C", "measurement": "1 segundo", "connectivity": "Bluetooth", "memory": "32 lecturas"}'::jsonb
  END
FROM products
WHERE slug IN ('vivago-watch', 'sos-pendant', 'vivago-domi', 'dosell-dispenser', 'bbrain-calendar', 'health-monitors', 'smart-scale', 'smart-thermometer')
AND NOT EXISTS (
  SELECT 1 FROM product_translations pt 
  WHERE pt.product_id = products.id AND pt.language = 'es'
);

-- Add Dutch translations for products
INSERT INTO product_translations (product_id, language, name, tagline, description, price_display, features, specs)
SELECT 
  id,
  'nl',
  CASE slug
    WHEN 'vivago-watch' THEN 'Vivago Smart Watch'
    WHEN 'sos-pendant' THEN 'SOS Hanger'
    WHEN 'vivago-domi' THEN 'Vivago Domi Sensor'
    WHEN 'dosell-dispenser' THEN 'Dosell Smart Dispenser'
    WHEN 'bbrain-calendar' THEN 'BBrain Kalenderklok'
    WHEN 'health-monitors' THEN 'Gezondheidsmonitoren'
    WHEN 'smart-scale' THEN 'Slimme Weegschaal'
    WHEN 'smart-thermometer' THEN 'Slimme Thermometer'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '24/7 welzijnsmonitoring met valdetectie'
    WHEN 'sos-pendant' THEN 'Discrete persoonlijke noodknop'
    WHEN 'vivago-domi' THEN 'Omgevings- en activiteitenmonitoring'
    WHEN 'dosell-dispenser' THEN 'Geautomatiseerd medicijnbeheer'
    WHEN 'bbrain-calendar' THEN 'Klok met cognitieve herinneringen'
    WHEN 'health-monitors' THEN 'Vitale functie monitoring apparaten'
    WHEN 'smart-scale' THEN 'Gewicht en lichaamssamenstelling tracking'
    WHEN 'smart-thermometer' THEN 'Contactloze temperatuurmonitoring'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN 'De Vivago Smart Watch biedt continue gezondheidsmonitoring met automatische valdetectie en SOS-waarschuwingen. Het bewaakt activiteitspatronen, slaapkwaliteit en algemeen welzijn terwijl het de onafhankelijkheid behoudt.'
    WHEN 'sos-pendant' THEN 'Draag gemoedsrust met deze discrete persoonlijke noodknop. Één druk waarschuwt onmiddellijk uw zorgteam en familie. Waterdicht en lange batterijduur.'
    WHEN 'vivago-domi' THEN 'De Vivago Domi sensor monitort thuisactiviteit en omgevingsomstandigheden. Detecteert ongebruikelijke activiteitspatronen en biedt inzicht in dagelijkse routines zonder camera''s.'
    WHEN 'dosell-dispenser' THEN 'De Dosell Smart Dispenser automatiseert medicijnbeheer met herinneringen en geplande afgifte. Zorgt voor medicatie therapietrouw en waarschuwt zorgverleners bij gemiste doses.'
    WHEN 'bbrain-calendar' THEN 'De BBrain Kalenderklok combineert een duidelijke, gemakkelijk te lezen klok met taak- en afspraakherinneringen. Ontworpen om cognitieve functie en onafhankelijkheid te ondersteunen.'
    WHEN 'health-monitors' THEN 'Medische monitors voor bloeddruk, hartslag, bloedzuurstof en meer. Gegevens automatisch gesynchroniseerd met uw zorgteam voor proactieve gezondheidsmonitoring.'
    WHEN 'smart-scale' THEN 'Volg gewichtstrends, BMI en lichaamssamenstelling. Deel automatisch gegevens met zorgverleners om vroege veranderingen te detecteren die kunnen wijzen op gezondheidsproblemen.'
    WHEN 'smart-thermometer' THEN 'Contactloze temperatuurmeting met directe resultaten. Volgt temperatuurtrends en waarschuwt zorgverleners bij afwijkende metingen voor vroege interventie.'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '€89/mnd'
    WHEN 'sos-pendant' THEN '€29/mnd'
    WHEN 'vivago-domi' THEN '€49/mnd'
    WHEN 'dosell-dispenser' THEN '€69/mnd'
    WHEN 'bbrain-calendar' THEN '€39/mnd'
    WHEN 'health-monitors' THEN '€59/mnd'
    WHEN 'smart-scale' THEN '€24/mnd'
    WHEN 'smart-thermometer' THEN '€19/mnd'
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '["24/7 welzijnsmonitoring", "Automatische valdetectie", "SOS-waarschuwingen", "Activiteit en slaap tracking", "Waterdicht", "7 dagen batterijduur"]'::jsonb
    WHEN 'sos-pendant' THEN '["Noodwaarschuwing met één knop", "Discreet draagbaar ontwerp", "Waterdicht", "Lange batterijduur (tot 3 jaar)", "Bereik tot 300m"]'::jsonb
    WHEN 'vivago-domi' THEN '["Activiteitenmonitoring zonder camera", "Patroonherkenning thuis", "Afwijkingsdetectie", "Omgevingstemperatuur monitoring", "Draadloos en discreet"]'::jsonb
    WHEN 'dosell-dispenser' THEN '["Automatische medicijnafgifte", "Programmeerbare herinneringen", "Therapietrouw waarschuwingen", "Veilige compartimenten", "Zorgverlener notificaties"]'::jsonb
    WHEN 'bbrain-calendar' THEN '["Duidelijk tijd/datum display", "Visuele en audio herinneringen", "Cognitieve ondersteuning", "Geen abonnement vereist", "Eenvoudig te gebruiken"]'::jsonb
    WHEN 'health-monitors' THEN '["Medische apparaten", "Automatische data synchronisatie", "Meerdere gezondheidsmetingen", "Monitoring op afstand", "Trend tracking"]'::jsonb
    WHEN 'smart-scale' THEN '["Lichaamssamenstelling analyse", "Meerdere gebruikersprofielen", "App integratie", "Trend tracking", "Delen met zorgprofessionals"]'::jsonb
    WHEN 'smart-thermometer' THEN '["Contactloze meting", "Directe resultaten", "Geschiedenis tracking", "Koorts waarschuwingen", "Hygiënisch en veilig"]'::jsonb
  END,
  CASE slug
    WHEN 'vivago-watch' THEN '{"batteryLife": "Tot 7 dagen", "connectivity": "Bluetooth, Mobiel", "waterResistance": "IP67", "weight": "45g"}'::jsonb
    WHEN 'sos-pendant' THEN '{"batteryLife": "Tot 3 jaar", "range": "300m", "waterResistance": "IPX7", "weight": "28g"}'::jsonb
    WHEN 'vivago-domi' THEN '{"connectivity": "WiFi", "sensors": "Beweging, Temperatuur", "dimensions": "12x8x3cm", "powerSource": "Kabel (batterij backup)"}'::jsonb
    WHEN 'dosell-dispenser' THEN '{"capacity": "28 compartimenten", "connectivity": "WiFi", "dimensions": "20x15x10cm", "powerSource": "Kabel (batterij backup)"}'::jsonb
    WHEN 'bbrain-calendar' THEN '{"displaySize": "8 inch", "connectivity": "WiFi (optioneel)", "dimensions": "22x17x2cm", "powerSource": "Kabel"}'::jsonb
    WHEN 'health-monitors' THEN '{"metrics": "Bloeddruk, Hartslag, SpO2, Glucose", "connectivity": "Bluetooth", "certification": "CE Medisch", "storage": "Tot 200 metingen"}'::jsonb
    WHEN 'smart-scale' THEN '{"maxWeight": "180kg", "connectivity": "Bluetooth, WiFi", "metrics": "8+ datapunten", "users": "Tot 8 profielen"}'::jsonb
    WHEN 'smart-thermometer' THEN '{"accuracy": "±0.2°C", "measurement": "1 seconde", "connectivity": "Bluetooth", "memory": "32 metingen"}'::jsonb
  END
FROM products
WHERE slug IN ('vivago-watch', 'sos-pendant', 'vivago-domi', 'dosell-dispenser', 'bbrain-calendar', 'health-monitors', 'smart-scale', 'smart-thermometer')
AND NOT EXISTS (
  SELECT 1 FROM product_translations pt 
  WHERE pt.product_id = products.id AND pt.language = 'nl'
);

-- Add Spanish translations for pricing plans
INSERT INTO plan_translations (plan_id, language, name, description, features)
SELECT 
  id,
  'es',
  CASE slug
    WHEN 'base' THEN 'Base'
    WHEN 'independent' THEN 'Independiente'
    WHEN 'chronic' THEN 'Condiciones Crónicas'
    WHEN 'mental' THEN 'Apoyo Mental'
  END,
  CASE slug
    WHEN 'base' THEN 'Perfecto para aquellos que necesitan monitoreo básico'
    WHEN 'independent' THEN 'Ideal para adultos mayores activos que valoran la independencia'
    WHEN 'chronic' THEN 'Cuidado integral para condiciones de salud complejas'
    WHEN 'mental' THEN 'Apoyo especializado para la salud mental y bienestar cognitivo'
  END,
  CASE slug
    WHEN 'base' THEN '["Reloj Inteligente Vivago", "Monitoreo 24/7", "Alertas SOS", "1 tablero familiar", "Soporte básico"]'::jsonb
    WHEN 'independent' THEN '["Reloj Vivago + Sensor Domi", "Monitoreo avanzado de actividad", "Detección de caídas", "3 tableros familiares", "Soporte prioritario", "Reportes de salud mensuales"]'::jsonb
    WHEN 'chronic' THEN '["Monitoreo completo de salud", "Gestión de medicamentos", "Múltiples sensores", "5 tableros familiares", "Soporte enfermería dedicada", "Reportes de salud semanales"]'::jsonb
    WHEN 'mental' THEN '["Reloj Vivago + Kalenderklok", "Recordatorios cognitivos", "Seguimiento del estado de ánimo", "3 tableros familiares", "Soporte especializado", "Evaluaciones de bienestar"]'::jsonb
  END
FROM pricing_plans
WHERE slug IN ('base', 'independent', 'chronic', 'mental')
AND NOT EXISTS (
  SELECT 1 FROM plan_translations pt 
  WHERE pt.plan_id = pricing_plans.id AND pt.language = 'es'
);

-- Add Dutch translations for pricing plans
INSERT INTO plan_translations (plan_id, language, name, description, features)
SELECT 
  id,
  'nl',
  CASE slug
    WHEN 'base' THEN 'Basis'
    WHEN 'independent' THEN 'Onafhankelijk'
    WHEN 'chronic' THEN 'Chronische Aandoeningen'
    WHEN 'mental' THEN 'Mentale Ondersteuning'
  END,
  CASE slug
    WHEN 'base' THEN 'Perfect voor wie basismonitoring nodig heeft'
    WHEN 'independent' THEN 'Ideaal voor actieve senioren die waarde hechten aan onafhankelijkheid'
    WHEN 'chronic' THEN 'Uitgebreide zorg voor complexe gezondheidsaandoeningen'
    WHEN 'mental' THEN 'Gespecialiseerde ondersteuning voor mentale gezondheid en cognitief welzijn'
  END,
  CASE slug
    WHEN 'base' THEN '["Vivago Smart Watch", "24/7 monitoring", "SOS waarschuwingen", "1 familie dashboard", "Basis ondersteuning"]'::jsonb
    WHEN 'independent' THEN '["Vivago Watch + Domi Sensor", "Geavanceerde activiteit monitoring", "Valdetectie", "3 familie dashboards", "Prioriteits ondersteuning", "Maandelijkse gezondheidsrapporten"]'::jsonb
    WHEN 'chronic' THEN '["Volledige gezondheidsmonitoring", "Medicijnbeheer", "Meerdere sensoren", "5 familie dashboards", "Toegewijde verpleegkundige ondersteuning", "Wekelijkse gezondheidsrapporten"]'::jsonb
    WHEN 'mental' THEN '["Vivago Watch + Kalenderklok", "Cognitieve herinneringen", "Stemming tracking", "3 familie dashboards", "Gespecialiseerde ondersteuning", "Welzijn beoordelingen"]'::jsonb
  END
FROM pricing_plans
WHERE slug IN ('base', 'independent', 'chronic', 'mental')
AND NOT EXISTS (
  SELECT 1 FROM plan_translations pt 
  WHERE pt.plan_id = pricing_plans.id AND pt.language = 'nl'
);