import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Check, Shield, Clock, Package, Sparkles } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { AccountForm } from "./AccountForm";
import { useProducts, Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/intl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getProductImageSync } from "@/lib/productImages";

const BASE_PLATFORM_PRICE = 49.99;

export const PickAndMixWizard = () => {
  const { t, i18n } = useTranslation('pricing');
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBaseDeviceId, setSelectedBaseDeviceId] = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Filter products by category
  const baseDevices = products?.filter(p => p.is_base_device) || [];
  const addonDevices = products?.filter(p => !p.is_base_device) || [];

  // Group addons by category
  const addonsByCategory = addonDevices.reduce((acc, product) => {
    const category = product.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const selectedBaseDevice = products?.find(p => p.id === selectedBaseDeviceId);
  const selectedAddons = products?.filter(p => selectedAddonIds.includes(p.id)) || [];

  // Calculate total
  const addonsTotal = selectedAddons.reduce((sum, d) => sum + (d.monthly_price || 0), 0);
  const totalMonthly = BASE_PLATFORM_PRICE + addonsTotal;

  const handleNext = () => {
    if (currentStep === 1 && !selectedBaseDeviceId) {
      toast.error(t('pickAndMix.selectBaseDevice'));
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleAccountSuccess = (newUserId: string, email: string) => {
    setUserId(newUserId);
    setUserEmail(email);
    setCurrentStep(4);
  };

  const handleCompleteOrder = async () => {
    if (!userId || !selectedBaseDeviceId) return;

    try {
      const allSelectedDevices = [selectedBaseDeviceId, ...selectedAddonIds];
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          created_by: userId,
          customer_email: userEmail,
          total_monthly: totalMonthly,
          selected_devices: allSelectedDevices.map(id => {
            const device = products?.find(p => p.id === id);
            return { 
              id, 
              name: device?.translation?.name, 
              price: device?.monthly_price,
              isBase: device?.is_base_device 
            };
          }),
          payment_status: 'pending',
          language: i18n.language,
        })
        .select()
        .single();

      if (error) throw error;

      setOrderId(order.id);
      setCurrentStep(5);
      toast.success(t('pickAndMix.orderSuccess'));
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(t('pickAndMix.orderError'));
    }
  };

  const toggleAddon = (id: string) => {
    setSelectedAddonIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      'emergency': t('customize.deviceCategories.emergency'),
      'home-monitoring': t('customize.deviceCategories.homeMonitoring'),
      'medication': t('customize.deviceCategories.medication'),
      'cognitive': t('customize.deviceCategories.cognitive'),
      'health': t('customize.deviceCategories.health'),
      'wearable': t('customize.deviceCategories.wearable'),
    };
    return categoryMap[category] || category;
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('customize.loadingOptions')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StepIndicator currentStep={currentStep} totalSteps={5} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Base Platform + Device Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('pickAndMix.step1Title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('pickAndMix.step1Subtitle')}
                </p>
              </div>

              {/* Base Platform Card */}
              <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{t('pickAndMix.platformTitle')}</CardTitle>
                      <CardDescription>{t('pickAndMix.platformDescription')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-secondary" />
                        {t('pickAndMix.feature1')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-secondary" />
                        {t('pickAndMix.feature2')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-secondary" />
                        {t('pickAndMix.feature3')}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-secondary" />
                        {t('pickAndMix.feature4')}
                      </li>
                    </ul>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">
                        {formatCurrency(BASE_PLATFORM_PRICE, 'EUR', i18n.language)}
                      </span>
                      <span className="text-muted-foreground">{t('planSelection.perMonth')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Base Device Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('pickAndMix.selectBaseDevice')}</CardTitle>
                  <CardDescription>{t('pickAndMix.baseDeviceIncluded')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {baseDevices.map(device => (
                      <Card
                        key={device.id}
                        className={`cursor-pointer transition-all ${
                          selectedBaseDeviceId === device.id
                            ? 'border-2 border-secondary shadow-lg'
                            : 'border hover:border-secondary/50'
                        }`}
                        onClick={() => setSelectedBaseDeviceId(device.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={getProductImageSync(device.slug, device.image_url)}
                              alt={device.translation?.name || device.slug}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{device.translation?.name}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {device.translation?.tagline}
                              </p>
                            </div>
                            {selectedBaseDeviceId === device.id && (
                              <Check className="h-5 w-5 text-secondary" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button size="lg" onClick={handleNext} disabled={!selectedBaseDeviceId}>
                  {t('buttons.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Add-on Devices & Services */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('pickAndMix.step2Title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('pickAndMix.step2Subtitle')}
                </p>
              </div>

              {Object.entries(addonsByCategory).map(([category, categoryProducts]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{getCategoryLabel(category)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryProducts.map(product => (
                        <div
                          key={product.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                            selectedAddonIds.includes(product.id)
                              ? 'border-secondary bg-secondary/5'
                              : 'hover:border-secondary/50'
                          }`}
                          onClick={() => toggleAddon(product.id)}
                        >
                          <Checkbox
                            checked={selectedAddonIds.includes(product.id)}
                            onCheckedChange={() => toggleAddon(product.id)}
                          />
                          <img
                            src={getProductImageSync(product.slug, product.image_url)}
                            alt={product.translation?.name || product.slug}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{product.translation?.name}</h4>
                              {product.is_popular && (
                                <Badge variant="secondary" className="text-xs">
                                  {t('planSelection.mostPopular')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.translation?.tagline}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-primary">
                              +{formatCurrency(product.monthly_price || 0, 'EUR', i18n.language)}
                            </span>
                            <span className="text-sm text-muted-foreground">{t('planSelection.perMonth')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('buttons.back')}
                </Button>
                <Button size="lg" onClick={handleNext}>
                  {t('buttons.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Account */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('account.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('account.subtitle')}
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <AccountForm 
                    onSuccess={handleAccountSuccess}
                    onSignIn={() => navigate('/auth/login')}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('buttons.back')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('review.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('review.subtitle')}
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('review.yourDetails')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-semibold">Email:</span> {userEmail}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('review.paymentMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="text-base">
                      {t('review.creditCard')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {t('review.securePayment')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('review.paymentDescription')}
                  </p>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>{t('review.secureCheckout')}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>{t('review.moneyBackGuarantee')}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('buttons.back')}
                </Button>
                <Button size="lg" onClick={handleCompleteOrder}>
                  {t('review.completeOrder')} <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-10 w-10 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('confirmation.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('confirmation.subtitle')}
                </p>
                {orderId && (
                  <Badge variant="outline" className="mt-2">
                    {t('confirmation.orderNumber')}: {orderId.slice(0, 8)}
                  </Badge>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('confirmation.nextSteps')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: Clock, text: t('confirmation.step1') },
                    { icon: Shield, text: t('confirmation.step2') },
                    { icon: Package, text: t('confirmation.step3') },
                    { icon: Check, text: t('confirmation.step4') },
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <step.icon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">{step.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  {t('confirmation.goToDashboard')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Order Summary */}
        {currentStep < 5 && (
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('orderSummary.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Base */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t('pickAndMix.platformTitle')}</p>
                    <p className="text-sm text-muted-foreground">{t('pickAndMix.includes1Device')}</p>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(BASE_PLATFORM_PRICE, 'EUR', i18n.language)}
                  </span>
                </div>

                {/* Base Device */}
                {selectedBaseDevice && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-secondary" />
                      <span>{selectedBaseDevice.translation?.name}</span>
                    </div>
                    <span className="text-muted-foreground">{t('pickAndMix.included')}</span>
                  </div>
                )}

                {/* Add-ons */}
                {selectedAddons.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2">{t('pickAndMix.addons')}</p>
                      <div className="space-y-2">
                        {selectedAddons.map(addon => (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span>{addon.translation?.name}</span>
                            <span>+{formatCurrency(addon.monthly_price || 0, 'EUR', i18n.language)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{t('orderSummary.monthlyTotal')}</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(totalMonthly, 'EUR', i18n.language)}
                    </span>
                    <span className="text-muted-foreground">{t('orderSummary.perMonth')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
