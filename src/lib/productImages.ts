// Lazy loading map for device images - reduces initial bundle size
const imageImporters: Record<string, () => Promise<{ default: string }>> = {
  'vivago-watch': () => import('@/assets/devices/vivago-watch.jpg'),
  'sos-pendant': () => import('@/assets/devices/sos-pendant.jpg'),
  'vivago-domi': () => import('@/assets/devices/vivago-domi.jpg'),
  'dosell-dispenser': () => import('@/assets/devices/dosell-dispenser.jpg'),
  'medication-dispenser': () => import('@/assets/devices/dosell-dispenser.jpg'),
  'bbrain-calendar': () => import('@/assets/devices/calendar-clock.jpg'),
  'health-monitors': () => import('@/assets/devices/health-monitors.jpg'),
  'blood-pressure': () => import('@/assets/devices/health-monitors.jpg'),
  'glucose-monitor': () => import('@/assets/devices/health-monitors.jpg'),
  'smart-scale': () => import('@/assets/devices/smart-scale.jpg'),
  'weight-scale': () => import('@/assets/devices/smart-scale.jpg'),
  'smart-thermometer': () => import('@/assets/devices/smart-thermometer.jpg'),
  'thermometer': () => import('@/assets/devices/smart-thermometer.jpg'),
};

// Cache for loaded images
const imageCache: Record<string, string> = {};

export const getProductImage = async (slug: string, imageUrl: string | null): Promise<string> => {
  if (imageUrl) return imageUrl;
  
  // Check cache first
  if (imageCache[slug]) return imageCache[slug];
  
  // Load image dynamically
  const importer = imageImporters[slug];
  if (importer) {
    try {
      const module = await importer();
      imageCache[slug] = module.default;
      return module.default;
    } catch (error) {
      console.error(`Failed to load image for ${slug}:`, error);
      return '/placeholder.svg';
    }
  }
  
  return '/placeholder.svg';
};

// Synchronous version for backwards compatibility (returns placeholder initially)
export const getProductImageSync = (slug: string, imageUrl: string | null): string => {
  if (imageUrl) return imageUrl;
  return imageCache[slug] || '/placeholder.svg';
};
