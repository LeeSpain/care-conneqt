import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Heart, Phone, CheckCircle2, ArrowRight } from "lucide-react";

const Guide = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Welcome to Care Conneqt
              </h1>
              <p className="text-xl text-muted-foreground">
                Your Complete Guide to Getting Started
              </p>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about joining, what to expect, and how Care Conneqt will support you and your loved ones.
              </p>
            </div>
          </div>
        </section>

        {/* What is Care Conneqt */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">What is Care Conneqt?</h2>
                <p className="text-lg text-muted-foreground">
                  Care Conneqt is a comprehensive home care solution that combines professional nursing care with cutting-edge technology to help your loved ones live independently and safely at home.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Nurse-Led Care</CardTitle>
                    <CardDescription>
                      All our services are led by qualified, experienced nurses who provide professional medical oversight and support 24/7.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>AI-Powered Monitoring</CardTitle>
                    <CardDescription>
                      Our AI Guardian works alongside nurses to provide continuous monitoring, daily check-ins, and instant alerts when needed.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                      <Heart className="h-6 w-6 text-success" />
                    </div>
                    <CardTitle>Medical-Grade Devices</CardTitle>
                    <CardDescription>
                      CE certified, medical-grade monitoring devices including smartwatches, health monitors, and emergency response systems.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <CardTitle>24/7 Support</CardTitle>
                    <CardDescription>
                      Round-the-clock emergency response, nurse call center, and AI companion available in English, Spanish, and Dutch.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
                <p className="text-lg text-muted-foreground">
                  Getting started with Care Conneqt is simple and straightforward
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Choose Your Plan</h3>
                    <p className="text-muted-foreground">
                      Select from our flexible care plans based on your needs: Base Membership (€49.99), Independent Living (€69.99), Chronic Disease Management (€119.99), or Mental Health & Wellness (€159.99). All plans include a 24-month service agreement with no setup fees.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Sign Up & Assessment</h3>
                    <p className="text-muted-foreground">
                      Complete our simple online registration. A qualified nurse will contact you within 24 hours to conduct a comprehensive health assessment and understand your specific care needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Device Delivery & Setup</h3>
                    <p className="text-muted-foreground">
                      Your medical devices arrive within 3-5 business days with free shipping. Our technical team provides remote setup assistance and ensures everything is working perfectly. All devices are pre-configured and ready to use.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      4
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Meet Your AI Guardian</h3>
                    <p className="text-muted-foreground">
                      Your AI Guardian begins daily check-ins, learning routines and preferences. Available 24/7 for conversations, health questions, and emergency assistance in your preferred language.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      5
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">Ongoing Care & Monitoring</h3>
                    <p className="text-muted-foreground">
                      Your dedicated nurse team provides regular check-ins (frequency based on your plan), health monitoring, medication management, and coordination with family members through the family dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">What You Get</h2>
                <p className="text-lg text-muted-foreground">
                  Every Care Conneqt membership includes comprehensive support
                </p>
              </div>

              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Medical-Grade Monitoring Devices
                    </CardTitle>
                    <CardDescription>
                      CE certified devices including smartwatches, SOS pendants, home sensors, medication dispensers, and health monitors. All devices are on a 24-month lease with free shipping, setup support, automatic replacement, and device protection included.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      AI Guardian Companion
                    </CardTitle>
                    <CardDescription>
                      Your personal AI health companion provides daily wellness check-ins, mood tracking, activity monitoring, emergency escalation, medication reminders, and companionship. Available 24/7 in English, Spanish, and Dutch.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Professional Nurse Support
                    </CardTitle>
                    <CardDescription>
                      Qualified nurses provide regular health assessments, medication management, care coordination, clinical documentation, and health education. Check-in frequency varies by plan: monthly (Base), weekly (Independent Living), or daily (Chronic Disease Management).
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      24/7 Emergency Call Center
                    </CardTitle>
                    <CardDescription>
                      Immediate response to emergency alerts, direct nurse triage, ambulance coordination if needed, family notifications, and comprehensive incident documentation. Priority response for Independent Living and above.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Family Dashboard Access
                    </CardTitle>
                    <CardDescription>
                      Real-time activity monitoring, health metrics tracking, medication compliance, nurse visit summaries, instant alerts for concerns, and secure messaging with care team. Number of family users varies by plan.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      Care Coordination
                    </CardTitle>
                    <CardDescription>
                      Integration with existing healthcare providers, appointment coordination, medical record management, caregiver support programs, and comprehensive care plans. Dedicated care coordinator included with Chronic Disease Management plan and above.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Transparent Pricing</h2>
                <p className="text-lg text-muted-foreground">
                  No hidden fees. No setup charges. Cancel anytime after 24 months.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Base Membership - €49.99/month</CardTitle>
                    <CardDescription>
                      Perfect for independent seniors who want peace of mind. Includes 1 device, AI Guardian, monthly nurse check-ins, and 24/7 emergency support.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-primary border-2">
                  <CardHeader>
                    <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                    <CardTitle>Independent Living - €69.99/month</CardTitle>
                    <CardDescription>
                      Enhanced monitoring for active seniors. Includes 2 devices, weekly nurse check-ins, priority emergency response, and family dashboard for 2 users.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chronic Disease Mgmt - €119.99/month</CardTitle>
                    <CardDescription>
                      Comprehensive care for managing chronic conditions. Includes 4 devices, daily nurse monitoring, medication management, vital signs tracking, and dedicated care coordinator.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mental Health & Wellness - €159.99/month</CardTitle>
                    <CardDescription>
                      Complete support including mental health services. Everything in Chronic plan plus weekly therapy sessions, mental health specialist, social wellness activities, and caregiver support.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle>Additional Devices Available</CardTitle>
                  <CardDescription className="space-y-2">
                    <p>Customize your plan with additional devices:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Extra Vivago Watch or SOS Pendant: +€19.99/month</li>
                      <li>Vivago Domi Home Sensors: +€29.99/month</li>
                      <li>Dosell Medication Dispenser: +€34.99/month</li>
                      <li>BBrain Calendar Clock: +€19.99/month</li>
                      <li>Health Monitors (BP, glucose): +€14.99/month each</li>
                      <li>Smart Weight Scale: +€14.99/month</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">What to Expect</h2>
                <p className="text-lg text-muted-foreground">
                  Your journey with Care Conneqt
                </p>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>First Week</CardTitle>
                    <CardDescription>
                      Devices arrive and are set up with remote technical support. Your AI Guardian introduces itself and begins learning your routine. Initial nurse assessment is completed, and your care plan is established. Family members receive dashboard access and training.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>First Month</CardTitle>
                    <CardDescription>
                      Your care team monitors initial data to establish baselines for activity, sleep, and vital signs. Regular check-ins begin according to your plan. AI Guardian adapts to your preferences and schedule. Family dashboard starts showing meaningful trends and insights.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ongoing Care</CardTitle>
                    <CardDescription>
                      Continuous 24/7 monitoring with AI-powered anomaly detection. Regular nurse visits and health assessments. Proactive alerts for concerning trends. Medication management and compliance tracking. Regular family updates and care team communication. Quarterly care plan reviews and adjustments.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Do I have to purchase the devices?</CardTitle>
                    <CardDescription>
                      No. All devices are included in your monthly subscription on a 24-month lease. This includes free shipping, setup support, technical assistance, automatic replacement if needed, and device protection insurance.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What if I need to cancel?</CardTitle>
                    <CardDescription>
                      Our service agreement is for 24 months. After that period, you can cancel at any time with 30 days notice. If you need to cancel before 24 months due to medical or financial hardship, please contact our support team to discuss options.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Are the nurses qualified healthcare professionals?</CardTitle>
                    <CardDescription>
                      Yes. All our nurses are fully qualified, registered healthcare professionals with experience in geriatric and home care. They maintain active licensure and participate in ongoing professional development.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Is my data secure and private?</CardTitle>
                    <CardDescription>
                      Absolutely. We are fully GDPR compliant with EU-based encrypted servers. All health data is end-to-end encrypted. Only your designated care team and approved family members can access your information. We never sell or share your data with third parties.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What happens in an emergency?</CardTitle>
                    <CardDescription>
                      Our 24/7 emergency call center is immediately notified. A qualified nurse triages the situation and can dispatch emergency services if needed. Your designated emergency contacts are automatically notified. All incidents are documented and reviewed by your care team.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                    <CardDescription>
                      Yes. You can change your care plan at any time. Upgrades take effect immediately. Downgrades take effect at the start of your next billing cycle. Additional devices can be added or removed with 30 days notice.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Do you work with insurance companies?</CardTitle>
                    <CardDescription>
                      We are working to establish partnerships with major health insurance providers. Currently, most plans are self-pay, but we can provide detailed invoices for potential reimbursement. Contact us to discuss your specific insurance situation.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/20">
                <CardHeader className="text-center space-y-6 p-8">
                  <div>
                    <CardTitle className="text-3xl mb-4">Ready to Get Started?</CardTitle>
                    <CardDescription className="text-lg">
                      Join thousands of families who trust Care Conneqt for peace of mind. Start your journey today.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <a href="/auth/signup">
                        {t('common:buttons.getStarted')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/personal-care">
                        View Pricing Plans
                      </a>
                    </Button>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Questions? Contact us at: <a href="mailto:hello@careconneqt.com" className="text-primary hover:underline">hello@careconneqt.com</a>
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Guide;
