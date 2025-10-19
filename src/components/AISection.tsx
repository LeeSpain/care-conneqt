import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageCircle, Brain, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AISection = () => {
  const { t } = useTranslation('home');
  
  const agentIcons = {
    sales: MessageCircle,
    guardian: Shield,
    nurse: Brain
  };

  const agents = ['sales', 'guardian', 'nurse'];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lilac/10 text-lilac text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            {t('ai.badge')}
          </div>
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            {t('ai.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('ai.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {agents.map((agent) => {
            const Icon = agentIcons[agent as keyof typeof agentIcons];
            const features = t(`ai.agents.${agent}.features`, { returnObjects: true }) as string[];
            
            return (
              <Card key={agent} className="border-2 hover:border-lilac/50 transition-all duration-300">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-gradient-to-br from-lilac/20 to-transparent w-fit mb-3">
                    <Icon className="h-8 w-8 text-lilac" />
                  </div>
                  <CardTitle className="text-xl font-['Poppins']">
                    {t(`ai.agents.${agent}.name`)}
                  </CardTitle>
                  <CardDescription>
                    {t(`ai.agents.${agent}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-lilac" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto p-6 rounded-xl bg-gradient-to-r from-lilac/5 via-secondary/5 to-primary/5 border border-lilac/20">
          <h3 className="text-xl font-semibold text-primary mb-2">
            {t('ai.privacy.title')}
          </h3>
          <p className="text-muted-foreground">
            {t('ai.privacy.description')}
          </p>
        </div>
      </div>
    </section>
  );
};
