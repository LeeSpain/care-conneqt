import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

export const InstitutionalFAQ = () => {
  const { t } = useTranslation('institutional-care');
  const faqs = t('faq.questions', { returnObjects: true }) as Array<{ question: string; answer: string }>;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('faq.subtitle')}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {t('faq.contactCta')}
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact-form">{t('faq.contactButton')}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
