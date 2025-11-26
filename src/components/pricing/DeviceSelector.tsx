import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/intl";
import { useTranslation } from "react-i18next";
import { Check, Star } from "lucide-react";
import { getProductImage } from "@/lib/productImages";
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
    <div className="space-y-8">
      {Object.entries(devicesByCategory).map(([category, categoryDevices]) => (
        <div key={category}>
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {getCategoryLabel(category)}
            </h4>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryDevices.map((device) => {
              const isSelected = selectedDeviceIds.includes(device.id);
              const imageUrl = getProductImage(device.slug, device.image_url);
              const features = device.translation?.features || [];
              
              return (
                <div
                  key={device.id}
                  className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-secondary bg-secondary/5 shadow-lg shadow-secondary/20'
                      : 'border-border hover:border-secondary/50 hover:shadow-md'
                  }`}
                  onClick={() => onToggle(device.id)}
                >
                  {/* Image Section */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
                    <img
                      src={imageUrl}
                      alt={device.translation?.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {device.is_popular && (
                      <Badge className="absolute top-2 right-2 bg-secondary text-white border-0">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        id={device.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          onToggle(device.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`h-6 w-6 border-2 ${
                          isSelected
                            ? 'bg-secondary border-secondary'
                            : 'bg-white/90 backdrop-blur-sm border-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Label htmlFor={device.id} className="cursor-pointer font-bold text-base leading-tight flex-1">
                        {device.translation?.name}
                      </Label>
                    </div>
                    
                    {device.translation?.tagline && (
                      <p className="text-xs text-secondary font-medium mb-2">
                        {device.translation.tagline}
                      </p>
                    )}
                    
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {device.translation?.description}
                    </p>

                    {/* Features List */}
                    {features.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-3 w-3 text-secondary mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-muted-foreground leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-muted-foreground">Add for</span>
                        <span className="text-xl font-bold text-secondary">
                          +{formatCurrency(device.monthly_price || 0, 'EUR', i18n.language)}
                        </span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0">
                          Added
                        </Badge>
                      )}
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