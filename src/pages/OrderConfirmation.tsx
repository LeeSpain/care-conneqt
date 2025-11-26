import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Package, Calendar, User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderConfirmation() {
  const { t, i18n } = useTranslation('pricing');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      toast.error("Order ID not found");
      navigate("/personal-care");
      return;
    }

    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          pricing_plans (
            slug,
            monthly_price,
            plan_translations (
              name,
              description,
              language
            )
          )
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('orderConfirmation.orderNotFound')}</h1>
          <Button onClick={() => navigate("/personal-care")}>
            {t('orderConfirmation.returnToPersonalCare')}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentLang = i18n.language.split('-')[0];
  const planTranslation = order.pricing_plans?.plan_translations?.find(
    (t: any) => t.language === currentLang
  ) || order.pricing_plans?.plan_translations?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-green" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              {t('orderConfirmation.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('orderConfirmation.thankYou')}
            </p>
            <Badge variant="secondary" className="mt-2">
              {t('orderConfirmation.orderNumber')}{order.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('orderConfirmation.orderDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t('orderConfirmation.plan')}</p>
                <p className="font-semibold">{planTranslation?.name || t('orderConfirmation.carePackage')}</p>
              </div>

              {order.selected_devices && Array.isArray(order.selected_devices) && order.selected_devices.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{t('orderConfirmation.additionalDevices')}</p>
                  <p className="font-semibold">{order.selected_devices.length} {t('orderConfirmation.devices')}</p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{t('orderConfirmation.monthlyTotal')}</span>
                <span className="text-2xl font-bold text-primary">
                  €{order.total_monthly?.toFixed(2) || '0.00'}/mo
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-semibold mb-1">{t('orderConfirmation.paymentStatus')}</p>
                <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                  {order.payment_status || 'pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('orderConfirmation.customerInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.customer_name && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer_name}</span>
                </div>
              )}
              {order.customer_email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer_email}</span>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.customer_phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('orderConfirmation.nextSteps')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">{t('orderConfirmation.step1Title')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderConfirmation.step1Desc')}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">{t('orderConfirmation.step2Title')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderConfirmation.step2Desc')}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">{t('orderConfirmation.step3Title')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderConfirmation.step3Desc')}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">{t('orderConfirmation.step4Title')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderConfirmation.step4Desc')}
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1" 
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              {t('orderConfirmation.goToDashboard')}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => navigate("/personal-care")}
            >
              {t('orderConfirmation.backToPersonalCare')}
            </Button>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>{t('orderConfirmation.needHelp')}{" "}
              <a href="mailto:support@careconneqt.com" className="text-primary underline">
                support@careconneqt.com
              </a>
              {" "}{t('orderConfirmation.orCall')}{" "}
              <a href="tel:+31201234567" className="text-primary underline">
                +31 20 123 4567
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
