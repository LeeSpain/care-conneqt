import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Conneqtivity() {
  const { t } = useTranslation('common');

  const brands = [
    {
      id: 'careconneqt',
      variant: 'careconneqt' as const,
      name: t('conneqtivity.careconneqt.name'),
      tagline: t('conneqtivity.careconneqt.tagline'),
      description: t('conneqtivity.careconneqt.description'),
      link: '/',
      gradient: 'from-[hsl(262,83%,58%)] to-[hsl(221,83%,53%)]',
      hoverBg: 'hover:bg-[hsl(262,83%,58%)]/10',
    },
    {
      id: 'medconneqt',
      variant: 'medconneqt' as const,
      name: t('conneqtivity.medconneqt.name'),
      tagline: t('conneqtivity.medconneqt.tagline'),
      description: t('conneqtivity.medconneqt.description'),
      link: '#',
      gradient: 'from-[hsl(173,80%,40%)] to-[hsl(215,85%,35%)]',
      hoverBg: 'hover:bg-[hsl(173,80%,40%)]/10',
    },
    {
      id: 'mobility',
      variant: 'mobility' as const,
      name: t('conneqtivity.mobility.name'),
      tagline: t('conneqtivity.mobility.tagline'),
      description: t('conneqtivity.mobility.description'),
      link: '#',
      gradient: 'from-[hsl(25,95%,53%)] to-[hsl(221,83%,53%)]',
      hoverBg: 'hover:bg-[hsl(25,95%,53%)]/10',
    },
    {
      id: 'safe',
      variant: 'safe' as const,
      name: t('conneqtivity.safe.name'),
      tagline: t('conneqtivity.safe.tagline'),
      description: t('conneqtivity.safe.description'),
      link: '#',
      gradient: 'from-[hsl(0,84%,60%)] to-[hsl(221,83%,53%)]',
      hoverBg: 'hover:bg-[hsl(0,84%,60%)]/10',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-secondary">
          <div className="container mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Logo size="lg" variant="parent" className="w-20 h-20" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t('conneqtivity.heroTitle')}
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              {t('conneqtivity.heroSubtitle')}
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('conneqtivity.heroDescription')}
            </p>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="container mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              {t('conneqtivity.brandsTitle')}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {brands.map((brand) => (
                <Card 
                  key={brand.id}
                  className={`group transition-all duration-300 border-2 ${brand.hoverBg} hover:shadow-xl`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <Logo size="lg" variant={brand.variant} className="w-16 h-16" />
                      <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${brand.gradient} bg-clip-text text-transparent`}>
                          {brand.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {brand.tagline}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-foreground/80 mb-6 leading-relaxed">
                      {brand.description}
                    </p>
                    
                    <Button 
                      asChild
                      variant="outline"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      <a href={brand.link}>
                        {t('buttons.learnMore')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
