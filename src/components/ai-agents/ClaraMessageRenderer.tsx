import { Check, Package, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanData {
  slug: string;
  monthly_price: number;
  is_popular?: boolean;
  plan_translations?: Array<{
    name: string;
    description?: string;
    features?: string[];
    language: string;
  }>;
}

interface ProductData {
  slug: string;
  monthly_price?: number;
  category: string;
  is_popular?: boolean;
  image_url?: string;
  color_class?: string;
  product_translations?: Array<{
    name: string;
    tagline?: string;
    description?: string;
    language: string;
  }>;
}

interface QuoteData {
  plan: PlanData;
  devices: ProductData[];
  totalMonthly: number;
}

interface MessageData {
  content: string;
  structuredData?: {
    type: 'plans' | 'products' | 'quote';
    data: PlanData[] | ProductData[] | QuoteData;
  };
}

interface Props {
  message: MessageData;
  language: string;
}

export const ClaraMessageRenderer = ({ message, language }: Props) => {
  const { content, structuredData } = message;

  const getTranslation = (translations: any[], lang: string, fallbackKey: string) => {
    const translation = translations?.find(t => t.language === lang);
    return translation?.[fallbackKey] || translations?.[0]?.[fallbackKey] || '';
  };

  return (
    <div className="space-y-4">
      {/* Text Content */}
      {content && (
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      )}

      {/* Structured Data Rendering */}
      {structuredData?.type === 'plans' && (
        <div className="grid gap-3 mt-4">
          {(structuredData.data as PlanData[]).map((plan) => {
            const name = getTranslation(plan.plan_translations || [], language, 'name');
            const description = getTranslation(plan.plan_translations || [], language, 'description');
            const features = plan.plan_translations?.find(t => t.language === language)?.features || [];

            return (
              <Card key={plan.slug} className="p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                {plan.is_popular && (
                  <Badge className="absolute top-2 right-2 bg-purple-500">Popular</Badge>
                )}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold text-base">{name}</h4>
                    <div className="text-right">
                      <span className="text-2xl font-bold">€{plan.monthly_price}</span>
                      <span className="text-xs text-muted-foreground">/month</span>
                    </div>
                  </div>
                  {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                  )}
                  {features.length > 0 && (
                    <ul className="space-y-1 mt-3">
                      {features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {structuredData?.type === 'products' && (
        <div className="grid gap-3 mt-4">
          {(structuredData.data as ProductData[]).map((product) => {
            const name = getTranslation(product.product_translations || [], language, 'name');
            const tagline = getTranslation(product.product_translations || [], language, 'tagline');

            return (
              <Card key={product.slug} className="p-3 hover:shadow-md transition-shadow">
                <div className="flex gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${product.color_class || 'bg-purple-500/10'}`}>
                    <Package className={`h-6 w-6 ${product.color_class || 'text-purple-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{name}</h4>
                        {tagline && (
                          <p className="text-xs text-muted-foreground mt-0.5">{tagline}</p>
                        )}
                      </div>
                      {product.monthly_price !== null && product.monthly_price !== undefined && (
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg font-bold">€{product.monthly_price}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {structuredData?.type === 'quote' && (
        <Card className="p-4 mt-4 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border-purple-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-purple-500" />
              <h4 className="font-semibold text-base">Your Custom Quote</h4>
            </div>
            
            {(() => {
              const quote = structuredData.data as QuoteData;
              const planName = getTranslation(quote.plan?.plan_translations || [], language, 'name');
              
              return (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium">{planName} Plan</span>
                      <span className="font-semibold">€{quote.plan?.monthly_price}</span>
                    </div>
                    
                    {quote.devices && quote.devices.length > 0 && (
                      <>
                        <div className="text-xs font-medium text-muted-foreground mt-3 mb-2">Add-on Devices:</div>
                        {quote.devices.map((device) => {
                          const deviceName = getTranslation(device.product_translations || [], language, 'name');
                          return (
                            <div key={device.slug} className="flex justify-between items-center py-1.5">
                              <span className="text-sm">{deviceName}</span>
                              <span className="text-sm font-medium">€{device.monthly_price}</span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t-2 border-purple-200">
                    <span className="text-base font-bold">Total Monthly</span>
                    <span className="text-2xl font-bold text-purple-600">€{quote.totalMonthly}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2">
                    * All devices include a 24-month lease with free shipping, setup, and 24/7 support
                  </p>
                </>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
};
