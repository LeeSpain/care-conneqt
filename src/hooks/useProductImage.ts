import { useState, useEffect } from 'react';

// Lazy loading map for device and service images
const imageImporters: Record<string, () => Promise<{ default: string }>> = {
  // Devices
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
  // Services
  'family-dashboard': () => import('@/assets/services/family-dashboard.jpg'),
  'extra-nurse-support': () => import('@/assets/services/nurse-support.jpg'),
  'priority-emergency': () => import('@/assets/services/emergency-response.jpg'),
  'care-coordinator': () => import('@/assets/services/care-coordinator.jpg'),
  'medication-management-service': () => import('@/assets/services/medication-management.jpg'),
};

// Global cache for loaded images
const imageCache: Record<string, string> = {};

export const useProductImage = (slug: string, imageUrl: string | null): string => {
  const [imageSrc, setImageSrc] = useState<string>(() => {
    // Check if we have an external URL
    if (imageUrl) return imageUrl;
    // Check cache first
    if (imageCache[slug]) return imageCache[slug];
    // Return placeholder initially
    return '/placeholder.svg';
  });

  useEffect(() => {
    // If we have an external URL, use it
    if (imageUrl) {
      setImageSrc(imageUrl);
      return;
    }

    // If already cached, use it
    if (imageCache[slug]) {
      setImageSrc(imageCache[slug]);
      return;
    }

    // Load image dynamically
    const importer = imageImporters[slug];
    if (importer) {
      importer()
        .then((module) => {
          imageCache[slug] = module.default;
          setImageSrc(module.default);
        })
        .catch((error) => {
          console.error(`Failed to load image for ${slug}:`, error);
          setImageSrc('/placeholder.svg');
        });
    }
  }, [slug, imageUrl]);

  return imageSrc;
};

// Preload all images for better UX
export const preloadProductImages = async (): Promise<void> => {
  const promises = Object.entries(imageImporters).map(async ([slug, importer]) => {
    if (!imageCache[slug]) {
      try {
        const module = await importer();
        imageCache[slug] = module.default;
      } catch (error) {
        console.error(`Failed to preload image for ${slug}:`, error);
      }
    }
  });
  await Promise.all(promises);
};

// Get image synchronously (only works if already cached)
export const getProductImageSync = (slug: string, imageUrl: string | null): string => {
  if (imageUrl) return imageUrl;
  return imageCache[slug] || '/placeholder.svg';
};
