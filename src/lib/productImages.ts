import vivagoWatchImg from '@/assets/devices/vivago-watch.jpg';
import sosPendantImg from '@/assets/devices/sos-pendant.jpg';
import vivagoDomiImg from '@/assets/devices/vivago-domi.jpg';
import dosellDispenserImg from '@/assets/devices/dosell-dispenser.jpg';
import bbrainCalendarImg from '@/assets/devices/calendar-clock.jpg';
import healthMonitorsImg from '@/assets/devices/health-monitors.jpg';
import smartScaleImg from '@/assets/devices/smart-scale.jpg';
import smartThermometerImg from '@/assets/devices/smart-thermometer.jpg';

const localImages: Record<string, string> = {
  'vivago-watch': vivagoWatchImg,
  'sos-pendant': sosPendantImg,
  'vivago-domi': vivagoDomiImg,
  'dosell-dispenser': dosellDispenserImg,
  'bbrain-calendar': bbrainCalendarImg,
  'health-monitors': healthMonitorsImg,
  'smart-scale': smartScaleImg,
  'smart-thermometer': smartThermometerImg,
};

export const getProductImage = (slug: string, imageUrl: string | null): string => {
  if (imageUrl) return imageUrl;
  return localImages[slug] || '/placeholder.svg';
};
