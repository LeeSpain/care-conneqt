import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Users, Heart, Phone, CheckCircle2, ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Guide = () => {
  const { t } = useTranslation(['common', 'home', 'guide']);

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
                <span className="text-sm font-medium text-primary">{t('guide:hero.badge')}</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
                {t('guide:hero.title')}
              </h1>
              
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                {t('guide:hero.subtitle')}
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t('guide:hero.description')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild className="text-lg px-8">
                  <Link to="/pricing">
                    {t('common:buttons.getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8">
                  <a href="#how-it-works">{t('guide:hero.learnHow')}</a>
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
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:whatIs.title')}</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t('guide:whatIs.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:whatIs.nurseLed.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:whatIs.nurseLed.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <Shield className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:whatIs.aiPowered.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:whatIs.aiPowered.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-primary/60 flex items-center justify-center shadow-lg">
                      <Heart className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:whatIs.medicalDevices.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:whatIs.medicalDevices.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/80 to-accent/60 flex items-center justify-center shadow-lg">
                      <Clock className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:whatIs.support.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:whatIs.support.description')}
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
                  <span className="text-sm font-medium text-primary">{t('guide:howItWorks.badge')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:howItWorks.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('guide:howItWorks.subtitle')}
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
                      <CardTitle className="text-2xl">{t('guide:howItWorks.steps.choosePlan.title')}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t('guide:howItWorks.steps.choosePlan.description')}
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
                      <CardTitle className="text-2xl">{t('guide:howItWorks.steps.signUp.title')}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t('guide:howItWorks.steps.signUp.description')}
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
                      <CardTitle className="text-2xl">{t('guide:howItWorks.steps.deviceDelivery.title')}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t('guide:howItWorks.steps.deviceDelivery.description')}
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
                      <CardTitle className="text-2xl">{t('guide:howItWorks.steps.meetGuardian.title')}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t('guide:howItWorks.steps.meetGuardian.description')}
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
                      <CardTitle className="text-2xl">{t('guide:howItWorks.steps.ongoingCare.title')}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {t('guide:howItWorks.steps.ongoingCare.description')}
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
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:whatYouGet.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('guide:whatYouGet.subtitle')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.devices.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.devices.description')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.aiGuardian.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.aiGuardian.description')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.nurseSupport.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.nurseSupport.description')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.emergency.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.emergency.description')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.familyDashboard.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.familyDashboard.description')}
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
                        <CardTitle className="text-xl">{t('guide:whatYouGet.items.careCoordination.title')}</CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {t('guide:whatYouGet.items.careCoordination.description')}
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
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:pricing.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('guide:pricing.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">{t('guide:pricing.plans.base.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:pricing.plans.base.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="relative border-2 border-primary shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-card">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-bold rounded-full">
                    {t('guide:pricing.plans.independent.badge')}
                  </div>
                  <CardHeader className="space-y-3 pt-6">
                    <CardTitle className="text-2xl">{t('guide:pricing.plans.independent.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:pricing.plans.independent.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">{t('guide:pricing.plans.chronic.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:pricing.plans.chronic.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl">{t('guide:pricing.plans.mental.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:pricing.plans.mental.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
                <CardHeader className="space-y-4">
                  <CardTitle className="text-2xl">{t('guide:pricing.addons.title')}</CardTitle>
                  <CardDescription className="space-y-4 text-base">
                    <p className="font-semibold">{t('guide:pricing.addons.subtitle')}</p>
                    <ul className="grid md:grid-cols-2 gap-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.watch')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.domi')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.dispenser')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.calendar')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.monitors')}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{t('guide:pricing.addons.items.scale')}</span>
                      </li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Commercial Partners */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 backdrop-blur-sm border border-accent/20">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-accent">{t('guide:commercial.badge')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:commercial.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {t('guide:commercial.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-accent/5">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <Shield className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:commercial.partners.healthcare.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:commercial.partners.healthcare.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:commercial.partners.municipalities.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:commercial.partners.municipalities.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-accent/5">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
                      <Heart className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:commercial.partners.insurance.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:commercial.partners.insurance.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <Clock className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl">{t('guide:commercial.partners.homecare.title')}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {t('guide:commercial.partners.homecare.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30">
                <CardHeader className="space-y-6">
                  <CardTitle className="text-3xl text-center">{t('guide:commercial.enterprise.title')}</CardTitle>
                  <div className="grid md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-3 text-center">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">{t('guide:commercial.enterprise.volumePricing.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('guide:commercial.enterprise.volumePricing.description')}</p>
                    </div>
                    <div className="space-y-3 text-center">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">{t('guide:commercial.enterprise.customIntegration.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('guide:commercial.enterprise.customIntegration.description')}</p>
                    </div>
                    <div className="space-y-3 text-center">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto" />
                      <h3 className="font-semibold text-lg">{t('guide:commercial.enterprise.dedicatedSupport.title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('guide:commercial.enterprise.dedicatedSupport.description')}</p>
                    </div>
                  </div>
                  <div className="text-center pt-6">
                    <Button size="lg" asChild className="text-lg px-8">
                      <Link to="/institutional-care">
                        {t('guide:commercial.enterprise.cta')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:whatToExpect.title')}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {t('guide:whatToExpect.subtitle')}
                </p>
              </div>

              <div className="space-y-6">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                        1
                      </div>
                      <CardTitle className="text-2xl">{t('guide:whatToExpect.timeline.firstWeek.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      {t('guide:whatToExpect.timeline.firstWeek.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-accent/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-accent-foreground font-bold group-hover:scale-110 transition-transform">
                        2
                      </div>
                      <CardTitle className="text-2xl">{t('guide:whatToExpect.timeline.firstMonth.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      {t('guide:whatToExpect.timeline.firstMonth.description')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold group-hover:scale-110 transition-transform">
                        3
                      </div>
                      <CardTitle className="text-2xl">{t('guide:whatToExpect.timeline.ongoing.title')}</CardTitle>
                    </div>
                    <CardDescription className="text-base leading-relaxed pl-13">
                      {t('guide:whatToExpect.timeline.ongoing.description')}
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
                <h2 className="text-4xl md:text-5xl font-bold text-foreground">{t('guide:faq.title')}</h2>
                <p className="text-xl text-muted-foreground">{t('guide:faq.subtitle')}</p>
              </div>

              <div className="grid gap-6">
                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-xl">{t('guide:faq.items.purchase.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.purchase.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.cancel.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.cancel.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.qualified.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.qualified.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.privacy.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.privacy.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.emergency.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.emergency.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.changePlan.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.changePlan.answer')}
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-lg">{t('guide:faq.items.insurance.question')}</CardTitle>
                    <CardDescription>
                      {t('guide:faq.items.insurance.answer')}
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
                      <span className="text-sm font-medium text-primary">{t('guide:cta.badge')}</span>
                    </div>
                    <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                      {t('guide:cta.title')}
                    </CardTitle>
                    <CardDescription className="text-xl leading-relaxed max-w-2xl mx-auto">
                      {t('guide:cta.description')}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button size="lg" asChild className="text-lg px-8 shadow-lg hover:shadow-xl transition-shadow">
                      <Link to="/pricing">
                        {t('common:buttons.getStarted')}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="text-lg px-8">
                      <Link to="/personal-care">
                        {t('guide:cta.viewPricing')}
                      </Link>
                    </Button>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      {t('guide:cta.contact')} <a href={`mailto:${t('guide:cta.email')}`} className="text-primary hover:underline">{t('guide:cta.email')}</a>
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
