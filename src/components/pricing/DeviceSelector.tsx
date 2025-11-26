import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/intl";
import { useTranslation } from "react-i18next";
import type { Product } from "@/hooks/useProducts";

interface DeviceSelectorProps {
  devices: Product[];
  selectedDeviceIds: string[];
  onToggle: (deviceId: string) => void;
}

export const DeviceSelector = ({ devices, selectedDeviceIds, onToggle }: DeviceSelectorProps) => {
  const { t, i18n } = useTranslation('pricing');
  
  // Group devices by category
  const devicesByCategory = devices.reduce((acc, device) => {
    if (!acc[device.category]) {
      acc[device.category] = [];
    }
    acc[device.category].push(device);
    return acc;
  }, {} as Record<string, Product[]>);

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'wearable': t('customize.deviceCategories.wearable'),
      'emergency': t('customize.deviceCategories.emergency'),
      'home-monitoring': t('customize.deviceCategories.homeMonitoring'),
      'medication': t('customize.deviceCategories.medication'),
      'cognitive': t('customize.deviceCategories.cognitive'),
      'health': t('customize.deviceCategories.health'),
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="space-y-6">
      {Object.entries(devicesByCategory).map(([category, categoryDevices]) => (
        <div key={category}>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {getCategoryLabel(category)}
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {categoryDevices.map((device) => {
              const isSelected = selectedDeviceIds.includes(device.id);
              
              return (
                <div
                  key={device.id}
                  className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:border-secondary/30'
                  }`}
                  onClick={() => onToggle(device.id)}
                >
                  <div className="flex gap-3">
                    <Checkbox
                      id={device.id}
                      checked={isSelected}
                      onCheckedChange={() => onToggle(device.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={device.id} className="cursor-pointer font-semibold text-sm leading-tight">
                        {device.translation?.name}
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                        {device.translation?.description}
                      </p>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-base font-bold text-secondary">
                          +{formatCurrency(device.monthly_price || 0, 'EUR', i18n.language)}
                        </span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};