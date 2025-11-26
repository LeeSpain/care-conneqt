import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/intl";
import { useTranslation } from "react-i18next";
import type { PricingPlan } from "@/hooks/usePricingPlans";
import type { Product } from "@/hooks/useProducts";

interface OrderSummaryProps {
  selectedPlan: PricingPlan | null;
  selectedDevices: Product[];
  additionalDashboards: number;
}

export const OrderSummary = ({ 
  selectedPlan, 
  selectedDevices, 
  additionalDashboards 
}: OrderSummaryProps) => {
  const { t, i18n } = useTranslation('pricing');
  
  const basePrice = selectedPlan?.monthly_price || 0;
  const devicesPrice = selectedDevices.reduce((sum, device) => sum + (device.monthly_price || 0), 0);
  const dashboardPrice = additionalDashboards * 2.99;
  const totalPrice = basePrice + devicesPrice + dashboardPrice;

  return (
    <Card className="border-2 border-secondary/20 shadow-xl sticky top-24">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardTitle className="text-xl font-['Poppins']">
          {t('orderSummary.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        {/* Base Plan */}
        {selectedPlan && (
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-2">
              {t('orderSummary.basePlan')}
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold">{selectedPlan.translation?.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {selectedPlan.devices_included} device{selectedPlan.devices_included !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="font-bold">
                {formatCurrency(basePrice, 'EUR', i18n.language)}
              </div>
            </div>
          </div>
        )}
        
        {/* Devices */}
        {selectedDevices.length > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                {t('orderSummary.devices')} ({selectedDevices.length})
              </div>
              <div className="space-y-2">
                {selectedDevices.map((device) => (
                  <div key={device.id} className="flex justify-between items-center text-sm">
                    <span>{device.translation?.name}</span>
                    <span className="font-semibold">
                      {formatCurrency(device.monthly_price || 0, 'EUR', i18n.language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Dashboards */}
        {additionalDashboards > 0 && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-2">
                {t('orderSummary.dashboards')}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{additionalDashboards}x Extra Dashboard{additionalDashboards !== 1 ? 's' : ''}</span>
                <span className="font-semibold">
                  {formatCurrency(dashboardPrice, 'EUR', i18n.language)}
                </span>
              </div>
            </div>
          </>
        )}
        
        <Separator className="my-4" />
        
        {/* Total */}
        <div className="flex justify-between items-center">
          <div className="font-bold text-lg">{t('orderSummary.monthlyTotal')}</div>
          <div className="text-3xl font-bold text-primary">
            {formatCurrency(totalPrice, 'EUR', i18n.language)}
            <span className="text-sm text-muted-foreground font-normal">
              {t('orderSummary.perMonth')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};