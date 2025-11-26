import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { getProductImageSync } from "@/lib/productImages";
import { getProductIcon } from "@/lib/productIcons";

export const DevicesSection = () => {
  const { t } = useTranslation('home');
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <section id="devices" className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">Loading devices...</p>
        </div>
      </section>
    );
  }

  // Show first 8 products
  const displayProducts = products?.slice(0, 8) || [];

  return (
    <section id="devices" className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('devices.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('devices.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {displayProducts.map((product) => {
            const Icon = getProductIcon(product.icon_name);
            return (
              <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-secondary/50">
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
                  <img 
                    src={getProductImageSync(product.slug, product.image_url)} 
                    alt={product.translation?.name || product.slug}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Care Connect Badge */}
                  <div className="absolute bottom-2 right-2 bg-background/95 backdrop-blur-sm px-2.5 py-1 rounded-full border border-primary/20 shadow-lg">
                    <span className="text-[10px] font-semibold text-primary">Care Connect</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${product.gradient_class} w-fit`}>
                      <Icon className={`h-5 w-5 ${product.color_class}`} />
                    </div>
                    <CardTitle className="text-base font-['Poppins'] leading-tight flex-1">
                      {product.translation?.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs min-h-[36px] leading-snug">
                    {product.translation?.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-primary">
                      {product.translation?.price_display || `€${product.monthly_price}/mo`}
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-xs hover:text-secondary"
                      asChild
                    >
                      <Link to="/devices">Details →</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                <strong className="text-primary">{t('devices.allInclude')}</strong> {t('devices.includeDetails')}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {t('devices.quality')}
              </p>
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary/90"
                asChild
              >
                <Link to="/devices">Explore All Devices</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
