import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planName: string;
  selectedDevices: Array<{ id: string; name: string; price: number }>;
  additionalDashboards: number;
  totalPrice: number;
}

export const CheckoutDialog = ({
  open,
  onOpenChange,
  planId,
  planName,
  selectedDevices,
  additionalDashboards,
  totalPrice,
}: CheckoutDialogProps) => {
  const { t } = useTranslation(['personal-care', 'common']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // Call clara-checkout edge function
      const { data: result, error } = await supabase.functions.invoke('clara-checkout', {
        body: {
          planId,
          devices: selectedDevices.map(d => d.id),
          customerName: data.name,
          customerEmail: data.email,
          customerPhone: data.phone,
          customerAddress: {
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
          },
        },
      });

      if (error) throw error;

      if (result?.orderId) {
        setOrderId(result.orderId);
        setOrderSuccess(true);
        toast.success("Order submitted successfully!");
      } else {
        throw new Error("Order creation failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    onOpenChange(false);
    if (orderId) {
      navigate(`/order-confirmation?id=${orderId}`);
    }
  };

  if (orderSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-emerald-green" />
            </div>
            <DialogTitle className="text-2xl mb-2">Order Received!</DialogTitle>
            <DialogDescription className="text-base mb-6">
              Thank you for choosing Care Conneqt. Your order has been submitted successfully.
            </DialogDescription>
            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold mb-2">What's Next:</p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Our team will contact you within 24 hours</li>
                <li>• Devices will be shipped within 3-5 business days</li>
                <li>• Create your account to access your dashboard</li>
              </ul>
            </div>
            <Button onClick={handleContinue} className="w-full">
              View Order Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
          <DialogDescription>
            Fill in your details to complete your Care Conneqt subscription
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <p className="font-semibold mb-2">Order Summary</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{planName}</span>
              <span className="font-semibold">€{totalPrice.toFixed(2)}/mo</span>
            </div>
            {selectedDevices.length > 0 && (
              <div className="text-xs text-muted-foreground">
                + {selectedDevices.length} additional device{selectedDevices.length !== 1 ? 's' : ''}
              </div>
            )}
            {additionalDashboards > 0 && (
              <div className="text-xs text-muted-foreground">
                + {additionalDashboards} family dashboard{additionalDashboards !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+31 6 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="Amsterdam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="1012 AB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="Netherlands" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      I accept the{" "}
                      <a href="/terms" className="text-primary underline" target="_blank">
                        terms and conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary underline" target="_blank">
                        privacy policy
                      </a>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Submit Order - €${totalPrice.toFixed(2)}/mo`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
