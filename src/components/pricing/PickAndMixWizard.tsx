import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, ArrowRight, Check, Shield, Clock, Package, Sparkles,
  Users, HeartPulse, UserCheck, Pill, Activity, Watch, Radio, Home,
  Calendar, Scale, Thermometer
} from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { AccountForm } from "./AccountForm";
import { useProducts, Product } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/intl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";

const BASE_PLATFORM_PRICE = 49.99;

// Icon map for services
const serviceIconMap: Record<string, React.ElementType> = {
  'Users': Users,
  'HeartPulse': HeartPulse,
  'Shield': Shield,
  'UserCheck': UserCheck,
  'Pill': Pill,
};

// Icon map for devices
const deviceIconMap: Record<string, React.ElementType> = {
  'Watch': Watch,
  'Radio': Radio,
  'Home': Home,
  'Calendar': Calendar,
  'Activity': Activity,
  'Scale': Scale,
  'Thermometer': Thermometer,
};

// Product Image wrapper component
const ProductImageWrapper = ({ product }: { product: Product }) => {
  return (
    <ProductImage
      slug={product.slug}
      imageUrl={product.image_url}
      alt={product.translation?.name || product.slug}
      className="w-full h-full object-cover rounded-lg"
    />
  );
};

// Service Icon component
const ServiceIcon = ({ iconName, className }: { iconName: string | null; className?: string }) => {
  const Icon = iconName ? serviceIconMap[iconName] || Activity : Activity;
  return <Icon className={className} />;
};

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

  // Filter products by type
  const baseDevices = products?.filter(p => p.is_base_device && p.product_type === 'device') || [];
  const addonDevices = products?.filter(p => !p.is_base_device && p.product_type === 'device') || [];
  const services = products?.filter(p => p.product_type === 'service') || [];

  // Group addon devices by category
  const addonsByCategory = addonDevices.reduce((acc, product) => {
    const category = product.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const selectedBaseDevice = products?.find(p => p.id === selectedBaseDeviceId);
  const selectedAddons = products?.filter(p => selectedAddonIds.includes(p.id)) || [];
  const selectedServices = selectedAddons.filter(a => a.product_type === 'service');
  const selectedDeviceAddons = selectedAddons.filter(a => a.product_type === 'device');

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
      const allSelectedItems = [selectedBaseDeviceId, ...selectedAddonIds];
      
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          created_by: userId,
          customer_email: userEmail,
          total_monthly: totalMonthly,
          selected_devices: allSelectedItems.map(id => {
            const item = products?.find(p => p.id === id);
            return { 
              id, 
              name: item?.translation?.name, 
              price: item?.monthly_price,
              isBase: item?.is_base_device,
              type: item?.product_type
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
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                  <div className="grid md:grid-cols-3 gap-4">
                    {baseDevices.map(device => (
                      <Card
                        key={device.id}
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedBaseDeviceId === device.id
                            ? 'ring-2 ring-secondary shadow-lg bg-secondary/5'
                            : 'hover:border-secondary/50'
                        }`}
                        onClick={() => setSelectedBaseDeviceId(device.id)}
                      >
                        <CardContent className="p-4">
                          <div className="aspect-square w-full mb-3 bg-muted/30 rounded-lg overflow-hidden">
                            <ProductImageWrapper product={device} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{device.translation?.name}</h4>
                              {selectedBaseDeviceId === device.id && (
                                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                                  <Check className="h-3 w-3 text-secondary-foreground" />
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {device.translation?.tagline}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {t('pickAndMix.included')}
                            </Badge>
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

          {/* Step 2: Add-on Services & Devices */}
          {currentStep === 2 && (
            <div className="space-y-10">
              <div className="text-center mb-8">
                <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary">
                  {t('pickAndMix.step2Badge') || 'Optional Add-ons'}
                </Badge>
                <h2 className="text-3xl font-bold font-['Poppins'] mb-3">
                  {t('pickAndMix.step2Title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {t('pickAndMix.step2Subtitle')}
                </p>
              </div>

              {/* Care Services Section */}
              {services.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-sm">
                      <HeartPulse className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{t('pickAndMix.servicesTitle')}</h3>
                      <p className="text-sm text-muted-foreground">{t('pickAndMix.servicesSubtitle') || 'Professional care support for your loved ones'}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    {services.map(service => (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                          selectedAddonIds.includes(service.id)
                            ? 'ring-2 ring-secondary shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5'
                            : 'hover:shadow-lg hover:border-secondary/40 border-border/60'
                        }`}
                        onClick={() => toggleAddon(service.id)}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col h-full">
                            {/* Header with icon and price */}
                            <div className={`p-5 ${selectedAddonIds.includes(service.id) ? 'bg-secondary/5' : 'bg-muted/20'} border-b border-border/40`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <div className={`p-3 rounded-xl ${service.gradient_class || 'bg-gradient-to-br from-primary/20 to-primary/5'} shadow-sm group-hover:scale-105 transition-transform`}>
                                    <ServiceIcon iconName={service.icon_name} className={`h-6 w-6 ${service.color_class || 'text-primary'}`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-base">{service.translation?.name}</h4>
                                      {service.is_popular && (
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 shadow-sm">
                                          {t('planSelection.mostPopular')}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {service.translation?.tagline}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0">
                                  <Checkbox
                                    checked={selectedAddonIds.includes(service.id)}
                                    onCheckedChange={() => toggleAddon(service.id)}
                                    className="h-5 w-5 mb-2"
                                  />
                                  <div className="text-right">
                                    <span className="font-bold text-lg text-primary">
                                      +{formatCurrency(service.monthly_price || 0, 'EUR', i18n.language)}
                                    </span>
                                    <span className="text-xs text-muted-foreground block">{t('planSelection.perMonth')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Features */}
                            <div className="p-5 flex-1">
                              <ul className="space-y-2.5">
                                {service.translation?.features?.slice(0, 3).map((feature, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                    <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check className="h-3 w-3 text-secondary" />
                                    </div>
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Devices Section */}
              {Object.keys(addonsByCategory).length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 shadow-sm">
                      <Activity className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{t('pickAndMix.devicesTitle')}</h3>
                      <p className="text-sm text-muted-foreground">{t('pickAndMix.devicesSubtitle') || 'Smart monitoring devices for peace of mind'}</p>
                    </div>
                  </div>

                  {Object.entries(addonsByCategory).map(([category, categoryProducts]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <span className="w-8 h-px bg-border"></span>
                        {getCategoryLabel(category)}
                        <span className="flex-1 h-px bg-border"></span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {categoryProducts.map(product => (
                          <Card
                            key={product.id}
                            className={`cursor-pointer transition-all duration-300 overflow-hidden group ${
                              selectedAddonIds.includes(product.id)
                                ? 'ring-2 ring-secondary shadow-lg bg-gradient-to-br from-secondary/10 to-secondary/5'
                                : 'hover:shadow-lg hover:border-secondary/40 border-border/60'
                            }`}
                            onClick={() => toggleAddon(product.id)}
                          >
                            <CardContent className="p-0">
                              <div className="flex gap-4 p-4">
                                {/* Product Image */}
                              <div className="relative shrink-0">
                                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 shadow-inner group-hover:shadow-md transition-shadow">
                                    <ProductImageWrapper product={product} />
                                  </div>
                                  {product.is_popular && (
                                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] px-2 py-0.5 shadow-md">
                                      {t('planSelection.popular') || 'Popular'}
                                    </Badge>
                                  )}
                                </div>
                                {/* Product Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <h4 className="font-semibold text-base leading-tight">{product.translation?.name}</h4>
                                      <Checkbox
                                        checked={selectedAddonIds.includes(product.id)}
                                        onCheckedChange={() => toggleAddon(product.id)}
                                        className="h-5 w-5 shrink-0"
                                      />
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                      {product.translation?.tagline}
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs font-normal">
                                      {getCategoryLabel(product.category || 'health')}
                                    </Badge>
                                    <div className="text-right">
                                      <span className="font-bold text-primary">
                                        +{formatCurrency(product.monthly_price || 0, 'EUR', i18n.language)}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-1">{t('planSelection.perMonth')}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="lg" onClick={handleBack} className="px-6">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {t('buttons.back')}
                </Button>
                <Button size="lg" onClick={handleNext} className="px-8 shadow-lg hover:shadow-xl transition-shadow">
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
                    <div><span className="font-semibold">{t('review.emailLabel')}:</span> {userEmail}</div>
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
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {t('orderSummary.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Base */}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t('pickAndMix.platformTitle')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('pickAndMix.includes1Device')}</span>
                    <span className="font-semibold">
                      {formatCurrency(BASE_PLATFORM_PRICE, 'EUR', i18n.language)}
                    </span>
                  </div>
                </div>

                {/* Base Device */}
                {selectedBaseDevice && (
                  <div className="flex items-center gap-3 text-sm p-2 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                      <ProductImageWrapper product={selectedBaseDevice} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{selectedBaseDevice.translation?.name}</span>
                      <p className="text-xs text-muted-foreground">{t('pickAndMix.included')}</p>
                    </div>
                    <Check className="h-4 w-4 text-secondary" />
                  </div>
                )}

                {/* Services */}
                {selectedServices.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium text-sm mb-2 flex items-center gap-2">
                        <HeartPulse className="h-4 w-4 text-primary" />
                        {t('pickAndMix.servicesTitle')}
                      </p>
                      <div className="space-y-2">
                        {selectedServices.map(service => (
                          <div key={service.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{service.translation?.name}</span>
                            <span className="font-medium">+{formatCurrency(service.monthly_price || 0, 'EUR', i18n.language)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Devices Add-ons */}
                {selectedDeviceAddons.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-secondary" />
                        {t('pickAndMix.devicesTitle')}
                      </p>
                      <div className="space-y-2">
                        {selectedDeviceAddons.map(addon => (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{addon.translation?.name}</span>
                            <span className="font-medium">+{formatCurrency(addon.monthly_price || 0, 'EUR', i18n.language)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Total */}
                <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{t('orderSummary.monthlyTotal')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(totalMonthly, 'EUR', i18n.language)}
                      </span>
                      <span className="text-muted-foreground text-sm">{t('orderSummary.perMonth')}</span>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-3 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>{t('review.secureCheckout')}</span>
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
