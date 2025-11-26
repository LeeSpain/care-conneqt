import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ArrowLeft, ArrowRight, Check, Shield, Clock, Package } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { PlanCard } from "./PlanCard";
import { OrderSummary } from "./OrderSummary";
import { DeviceSelector } from "./DeviceSelector";
import { AccountForm } from "./AccountForm";
import { usePricingPlans } from "@/hooks/usePricingPlans";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency } from "@/lib/intl";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PricingWizard = () => {
  const { t, i18n } = useTranslation('pricing');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: plans, isLoading: plansLoading } = usePricingPlans();
  const { data: products, isLoading: productsLoading } = useProducts();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    searchParams.get('plan') || null
  );
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);
  const [additionalDashboards, setAdditionalDashboards] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const selectedPlan = plans?.find(p => p.id === selectedPlanId);
  const selectedDevices = products?.filter(p => selectedDeviceIds.includes(p.id)) || [];
  const deviceProducts = products?.filter(p => p.category !== 'subscription') || [];

  const handleNext = () => {
    if (currentStep === 1 && !selectedPlanId) {
      toast.error("Please select a plan");
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
    if (!selectedPlan || !userId) return;

    try {
      const totalPrice = 
        selectedPlan.monthly_price +
        selectedDevices.reduce((sum, d) => sum + (d.monthly_price || 0), 0) +
        (additionalDashboards * 2.99);

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          plan_id: selectedPlan.id,
          created_by: userId,
          customer_email: userEmail,
          selected_devices: selectedDeviceIds.map(id => {
            const device = products?.find(p => p.id === id);
            return { id, name: device?.translation?.name, price: device?.monthly_price };
          }),
          payment_status: 'pending',
          language: i18n.language,
        })
        .select()
        .single();

      if (error) throw error;

      setOrderId(order.id);
      setCurrentStep(5);
      toast.success("Order created successfully!");
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error("Failed to create order");
    }
  };

  if (plansLoading || productsLoading) {
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
          {/* Step 1: Plan Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('planSelection.title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('planSelection.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {plans?.map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isSelected={selectedPlanId === plan.id}
                    onSelect={() => setSelectedPlanId(plan.id)}
                  />
                ))}
              </div>

              <div className="flex justify-end">
                <Button size="lg" onClick={handleNext} disabled={!selectedPlanId}>
                  {t('buttons.continue')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Customize */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold font-['Poppins'] mb-2">
                  {t('customize.title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('customize.subtitle')}
                </p>
              </div>

              {/* Promotional Banner */}
              <div className="bg-gradient-to-r from-secondary/10 via-primary/10 to-secondary/10 rounded-xl p-6 mb-6 border border-secondary/20">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-bold text-foreground">
                    Enhance Your Care Package
                  </h3>
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                  Add specialized monitoring devices to create a comprehensive care solution. Each device seamlessly integrates with your dashboard for complete peace of mind.
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{t('customize.devicesTitle')}</CardTitle>
                      <CardDescription className="text-base">{t('customize.devicesSubtitle')}</CardDescription>
                    </div>
                    {selectedDeviceIds.length > 0 && (
                      <Badge variant="secondary" className="text-base px-4 py-1">
                        {selectedDeviceIds.length} selected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {deviceProducts && deviceProducts.length > 0 ? (
                    <DeviceSelector
                      devices={deviceProducts}
                      selectedDeviceIds={selectedDeviceIds}
                      onToggle={(id) => {
                        setSelectedDeviceIds(prev =>
                          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                        );
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {t('customize.noDevicesSelected')}
                    </p>
                  )}
                </CardContent>
              </Card>

              {selectedPlan && selectedPlan.family_dashboards !== -1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('customize.dashboardsTitle')}</CardTitle>
                    <CardDescription>{t('customize.dashboardsSubtitle')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold mb-1">{t('customize.dashboardAccessLabel')}</div>
                        <div className="text-sm text-muted-foreground">
                          {t('customize.dashboardPrice')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setAdditionalDashboards(Math.max(0, additionalDashboards - 1))}
                          disabled={additionalDashboards === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold text-2xl w-12 text-center">{additionalDashboards}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setAdditionalDashboards(additionalDashboards + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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

        {/* Sidebar - Order Summary (hidden on step 5) */}
        {currentStep < 5 && (
          <div className="lg:col-span-1">
            <OrderSummary
              selectedPlan={selectedPlan || null}
              selectedDevices={selectedDevices}
              additionalDashboards={additionalDashboards}
            />
          </div>
        )}
      </div>
    </div>
  );
};