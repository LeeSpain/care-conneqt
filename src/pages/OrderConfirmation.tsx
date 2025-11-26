import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Button onClick={() => navigate("/personal-care")}>
            Return to Personal Care
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const planTranslation = order.pricing_plans?.plan_translations?.find(
    (t: any) => t.language === 'en'
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
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for choosing Care Conneqt
            </p>
            <Badge variant="secondary" className="mt-2">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </Badge>
          </div>

          {/* Order Details Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <p className="font-semibold">{planTranslation?.name || 'Care Package'}</p>
              </div>

              {order.selected_devices && Array.isArray(order.selected_devices) && order.selected_devices.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Additional Devices</p>
                  <p className="font-semibold">{order.selected_devices.length} device(s)</p>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Monthly Total</span>
                <span className="text-2xl font-bold text-primary">
                  €{order.total_monthly?.toFixed(2) || '0.00'}/mo
                </span>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-semibold mb-1">Payment Status</p>
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
                Customer Information
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
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a detailed confirmation email within the next few minutes
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Welcome Call</p>
                    <p className="text-sm text-muted-foreground">
                      Our care team will contact you within 24 hours to discuss your setup
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Device Delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Your devices will be shipped within 3-5 business days, pre-configured and ready to use
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Account Setup</p>
                    <p className="text-sm text-muted-foreground">
                      Create your account to access your dashboard and start monitoring care
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
              onClick={() => navigate("/auth/signup")}
            >
              Create Your Account
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => navigate("/personal-care")}
            >
              Back to Personal Care
            </Button>
          </div>

          {/* Support Section */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Need help? Contact us at{" "}
              <a href="mailto:support@careconneqt.com" className="text-primary underline">
                support@careconneqt.com
              </a>
              {" "}or call{" "}
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
