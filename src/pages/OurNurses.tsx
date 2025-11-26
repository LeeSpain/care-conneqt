import { useTranslation } from 'react-i18next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ClaraWidget } from '@/components/ai-agents/ClaraWidget';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Clock, Award, CheckCircle, Phone, Users } from 'lucide-react';
import nursesHero from '@/assets/nurses-hero.jpg';
import nurseSarah from '@/assets/nurse-sarah.jpg';
import nurseJames from '@/assets/nurse-james.jpg';
import nurseMaria from '@/assets/nurse-maria.jpg';
import nurseDavid from '@/assets/nurse-david.jpg';
import nurseEmma from '@/assets/nurse-emma.jpg';
import nurseAisha from '@/assets/nurse-aisha.jpg';

export default function OurNurses() {
  const { t } = useTranslation(['nurses', 'home', 'common']);
  
  const nurseImages = [nurseSarah, nurseJames, nurseMaria, nurseDavid, nurseEmma, nurseAisha];
  const nursesData = t('nurses:team.nurses', { returnObjects: true });
  
  // Ensure nursesData is an array before mapping
  const nursesArray = Array.isArray(nursesData) ? nursesData : [];
  
  const nurses = nursesArray.map((nurse: any, index: number) => ({
    ...nurse,
    image: nurseImages[index]
  }));

  const certificationIcons = [Shield, Heart, Shield, Heart, Users, Award];
  const certificationsData = t('nurses:certifications.items', { returnObjects: true });
  const certifications = (Array.isArray(certificationsData) ? certificationsData : []).map((name: string, index: number) => ({
    name,
    icon: certificationIcons[index]
  }));

  const statsIcons = [Clock, Users, Award, Phone];
  const statsDataRaw = [
    t('nurses:stats.coverage', { returnObjects: true }),
    t('nurses:stats.staff', { returnObjects: true }),
    t('nurses:stats.experience', { returnObjects: true }),
    t('nurses:stats.response', { returnObjects: true })
  ];
  
  // Ensure each stat is a valid object with value and label
  const statsData = statsDataRaw.filter((stat): stat is { value: string; label: string } => 
    stat && typeof stat === 'object' && 'value' in stat && 'label' in stat
  );
  
  const stats = statsData.map((stat, index) => ({
    ...stat,
    icon: statsIcons[index]
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <Badge className="mb-4" variant="secondary">
                  <Heart className="h-3 w-3 mr-1" />
                  {t('nurses:hero.badge')}
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  {t('nurses:hero.title')}
                  <span className="block text-secondary mt-2">{t('nurses:hero.titleHighlight')}</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t('nurses:hero.subtitle')}
                </p>
              </div>
              <div className="relative">
                <img 
                  src={nursesHero} 
                  alt="Professional nursing team" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Nurses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('nurses:whyDifferent.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">{t('nurses:whyDifferent.qualified.title')}</h3>
                  <CardDescription>
                    {t('nurses:whyDifferent.qualified.description')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">{t('nurses:whyDifferent.specialist.title')}</h3>
                  <CardDescription>
                    {t('nurses:whyDifferent.specialist.description')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Clock className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">{t('nurses:whyDifferent.available.title')}</h3>
                  <CardDescription>
                    {t('nurses:whyDifferent.available.description')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-secondary/20">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">{t('nurses:whyDifferent.personCentered.title')}</h3>
                  <CardDescription>
                    {t('nurses:whyDifferent.personCentered.description')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('nurses:team.title')}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('nurses:team.subtitle')}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nurses.map((nurse, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <img 
                      src={nurse.image} 
                      alt={nurse.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold">{nurse.name}</h3>
                    <p className="text-secondary font-semibold">{nurse.title}</p>
                    <p className="text-sm text-muted-foreground">{nurse.credentials}</p>
                    <Badge variant="outline" className="w-fit mt-2">{nurse.experience}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{nurse.bio}</p>
                    <div>
                      <p className="text-xs font-semibold mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {nurse.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t('nurses:team.footer')}
            </p>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('nurses:certifications.title')}
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <cert.icon className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="font-medium text-sm">{cert.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {t('nurses:howItWorks.title')}
            </h2>

            <div className="space-y-6">
              {(() => {
                const stepsData = t('nurses:howItWorks.steps', { returnObjects: true });
                const steps = Array.isArray(stepsData) ? stepsData : [];
                return steps.map((step: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center flex-shrink-0 font-bold">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20">
            <CardContent className="p-12 text-center">
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">{t('home:cta.title')}</h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t('home:cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90" asChild>
                  <a href="/personal-care">{t('common:buttons.learnMore')}</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/pricing">{t('common:buttons.getStarted')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      <ClaraWidget />
    </div>
  );
}
