import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DeviceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  tagline: string;
  description: string;
  price: string;
  features: string[];
  specs: Record<string, string>;
  image: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

export function DeviceDetailsModal({
  open,
  onOpenChange,
  name,
  tagline,
  description,
  price,
  features,
  specs,
  image,
  icon: Icon,
  color,
  gradient,
}: DeviceDetailsModalProps) {
  const { t } = useTranslation(['devices', 'common']);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-7 w-7 ${color}`} />
            </div>
            <div>
              <DialogTitle className="text-2xl mb-1">{name}</DialogTitle>
              <p className={`text-base font-medium ${color}`}>{tagline}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/10">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 shadow-lg">
              <span className="text-sm font-semibold text-primary">Care Connect</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 py-4 border-y border-border">
            <span className="text-3xl font-bold text-primary">{price}</span>
          </div>

          {/* All Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('cta.keyFeatures')}</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('cta.technicalSpecs')}</h3>
            <div className="space-y-3 bg-muted/30 rounded-lg p-4">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-medium text-muted-foreground">{key}:</span>
                  <span className="text-sm font-semibold text-right ml-4">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-secondary hover:bg-secondary/90" asChild>
              <a href="/auth/signup">Add to Package</a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href="/personal-care">View Plans</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
