import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Heart, Phone, CheckCircle2, ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Guide = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Your Journey Starts Here</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
                Welcome to Care Conneqt
              </h1>
              
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                Your Complete Guide to Getting Started
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about joining, what to expect, and how Care Conneqt will support you and your loved ones with professional, compassionate care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/signup">
                    {t('buttons.getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <a href="#how-it-works">Learn How It Works</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What is Care Conneqt */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">What is Care Conneqt?</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Care Conneqt is a comprehensive home care solution that combines professional nursing care with cutting-edge technology to help your loved ones live independently and safely at home.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Nurse-Led Care</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      All our services are led by qualified, experienced nurses who provide professional medical oversight and support 24/7.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <Shield className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">AI-Powered Monitoring</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Our AI Guardian works alongside nurses to provide continuous monitoring, daily check-ins, and instant alerts when needed.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                      <Heart className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">Medical-Grade Devices</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      CE certified, medical-grade monitoring devices including smartwatches, health monitors, and emergency response systems.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/80 to-accent/60 flex items-center justify-center shadow-lg">
                      <Clock className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">24/7 Support</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Round-the-clock emergency response, nurse call center, and AI companion available in English, Spanish, and Dutch.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/50 to-accent/5" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Simple 5-Step Process</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">How It Works</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Getting started with Care Conneqt is simple and straightforward
                </p>
              </div>

              <div className="space-y-8">
                <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row gap-6 space-y-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
                        1
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Select from our flexible care plans based on your needs: Base Membership (€49.99), Independent Living (€69.99), Chronic Disease Management (€119.99), or Mental Health & Wellness (€159.99). All plans include a 24-month service agreement with no setup fees.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row gap-6 space-y-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center font-bold text-2xl text-accent-foreground shadow-lg">
                        2
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl">Sign Up & Assessment</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Complete our simple online registration. A qualified nurse will contact you within 24 hours to conduct a comprehensive health assessment and understand your specific care needs.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row gap-6 space-y-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl">Device Delivery & Setup</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Your medical devices arrive within 3-5 business days with free shipping. Our technical team provides remote setup assistance and ensures everything is working perfectly. All devices are pre-configured and ready to use.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-accent hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row gap-6 space-y-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center font-bold text-2xl text-accent-foreground shadow-lg">
                        4
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl">Meet Your AI Guardian</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Your AI Guardian begins daily check-ins, learning routines and preferences. Available 24/7 for conversations, health questions, and emergency assistance in your preferred language.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row gap-6 space-y-0">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg">
                        5
                      </div>
                    </div>
                    <div className="space-y-3 flex-1">
                      <CardTitle className="text-2xl">Ongoing Care & Monitoring</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        Your dedicated nurse team provides regular check-ins (frequency based on your plan), health monitoring, medication management, and coordination with family members through the family dashboard.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">What You Get</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Every Care Conneqt membership includes comprehensive support
                </p>
              </div>

              <div className="grid gap-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">Medical-Grade Monitoring Devices</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          CE certified devices including smartwatches, SOS pendants, home sensors, medication dispensers, and health monitors. All devices are on a 24-month lease with free shipping, setup support, automatic replacement, and device protection included.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">AI Guardian Companion</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Your personal AI health companion provides daily wellness check-ins, mood tracking, activity monitoring, emergency escalation, medication reminders, and companionship. Available 24/7 in English, Spanish, and Dutch.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">Professional Nurse Support</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Qualified nurses provide regular health assessments, medication management, care coordination, clinical documentation, and health education. Check-in frequency varies by plan: monthly (Base), weekly (Independent Living), or daily (Chronic Disease Management).
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">24/7 Emergency Call Center</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Immediate response to emergency alerts, direct nurse triage, ambulance coordination if needed, family notifications, and comprehensive incident documentation. Priority response for Independent Living and above.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">Family Dashboard Access</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Real-time activity monitoring, health metrics tracking, medication compliance, nurse visit summaries, instant alerts for concerns, and secure messaging with care team. Number of family users varies by plan.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl">Care Coordination</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          Integration with existing healthcare providers, appointment coordination, medical record management, caregiver support programs, and comprehensive care plans. Dedicated care coordinator included with Chronic Disease Management plan and above.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Overview */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/50 to-accent/5" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">Transparent Pricing</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  No hidden fees. No setup charges. Cancel anytime after 24 months.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">Base Membership - €49.99/month</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Perfect for independent seniors who want peace of mind. Includes 1 device, AI Guardian, monthly nurse check-ins, and 24/7 emergency support.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="relative border-2 border-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-card">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                  <CardHeader className="space-y-3 pt-6">
                    <CardTitle className="text-2xl">Independent Living - €69.99/month</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Enhanced monitoring for active seniors. Includes 2 devices, weekly nurse check-ins, priority emergency response, and family dashboard for 2 users.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">Chronic Disease Mgmt - €119.99/month</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Comprehensive care for managing chronic conditions. Includes 4 devices, daily nurse monitoring, medication management, vital signs tracking, and dedicated care coordinator.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">Mental Health & Wellness - €159.99/month</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      Complete support including mental health services. Everything in Chronic plan plus weekly therapy sessions, mental health specialist, social wellness activities, and caregiver support.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl">Additional Devices Available</CardTitle>
                  <CardDescription className="space-y-4 text-base">
                    <p className="font-semibold">Customize your plan with additional devices:</p>
                    <ul className="grid md:grid-cols-2 gap-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Extra Vivago Watch or SOS Pendant: +€19.99/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Vivago Domi Home Sensors: +€29.99/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Dosell Medication Dispenser: +€34.99/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>BBrain Calendar Clock: +€19.99/month</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Health Monitors (BP, glucose): +€14.99/month each</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>Smart Weight Scale: +€14.99/month</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">What to Expect</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Your journey with Care Conneqt
                </p>
              </div>

              <div className="space-y-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                        1
                      </div>
                      <CardTitle className="text-2xl">First Week</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      Devices arrive and are set up with remote technical support. Your AI Guardian introduces itself and begins learning your routine. Initial nurse assessment is completed, and your care plan is established. Family members receive dashboard access and training.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-accent/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-accent-foreground font-bold group-hover:scale-110 transition-transform">
                        2
                      </div>
                      <CardTitle className="text-2xl">First Month</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      Your care team monitors initial data to establish baselines for activity, sleep, and vital signs. Regular check-ins begin according to your plan. AI Guardian adapts to your preferences and schedule. Family dashboard starts showing meaningful trends and insights.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                        3
                      </div>
                      <CardTitle className="text-2xl">Ongoing Care</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      Continuous 24/7 monitoring with AI-powered anomaly detection. Regular nurse visits and health assessments. Proactive alerts for concerning trends. Medication management and compliance tracking. Regular family updates and care team communication. Quarterly care plan reviews and adjustments.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted/50 to-accent/5" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">Frequently Asked Questions</h2>
                <p className="text-xl text-muted-foreground">Everything you need to know</p>
              </div>

              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-xl">Do I have to purchase the devices?</CardTitle>
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
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm">
                <CardHeader className="text-center space-y-8 p-12">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                      <Star className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-primary">Join Our Community</span>
                    </div>
                    <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                      Ready to Get Started?
                    </CardTitle>
                    <CardDescription className="text-xl leading-relaxed max-w-2xl mx-auto">
                      Join thousands of families who trust Care Conneqt for peace of mind. Start your journey today.
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" asChild className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                      <Link to="/signup">
                        {t('common:buttons.getStarted')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="text-lg px-8">
                      <Link to="/personal-care">
                        View Pricing Plans
                      </Link>
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
