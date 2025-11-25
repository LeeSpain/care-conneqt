import { 
  Watch, 
  Radio, 
  Home, 
  Pill, 
  Calendar, 
  Activity, 
  Scale, 
  Thermometer,
  type LucideIcon 
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Watch': Watch,
  'Radio': Radio,
  'Home': Home,
  'Pill': Pill,
  'Calendar': Calendar,
  'Activity': Activity,
  'Scale': Scale,
  'Thermometer': Thermometer,
};

export const getProductIcon = (iconName: string | null): LucideIcon => {
  if (!iconName) return Activity;
  return iconMap[iconName] || Activity;
};
