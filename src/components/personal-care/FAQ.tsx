import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "What is the contract commitment?",
      answer: "All Care Conneqt packages require a 24-month service agreement. This commitment allows us to offer the best pricing on devices and services. Early termination options are available - please contact our support team to discuss your specific situation."
    },
    {
      question: "What is included in the monthly price?",
      answer: "Your monthly fee includes device lease (no purchase required), 24/7 nurse monitoring, AI Guardian access, emergency response, device maintenance, automatic replacements, and all shipping costs. No hidden fees or setup charges."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. Any prorated charges will be adjusted automatically."
    },
    {
      question: "What languages does the AI Guardian support?",
      answer: "The AI Guardian currently supports English, Spanish (Español), and Dutch (Nederlands). We're working to add French, German, and Italian in the coming months."
    },
    {
      question: "How quickly do nurses respond to alerts?",
      answer: "Emergency alerts receive immediate response (within 2-3 minutes). Routine alerts are typically addressed within 15-30 minutes. Priority response times vary by plan tier."
    },
    {
      question: "Do I need technical skills to set up devices?",
      answer: "No! All devices arrive pre-configured and ready to use. Simply plug them in or wear them. Our setup guide walks you through activation, and our support team is available 24/7 if you need help."
    },
    {
      question: "Can multiple family members access the dashboard?",
      answer: "Yes! Family dashboard access depends on your plan. Base Membership includes 0 dashboards (member-only), Independent Living includes 2, and higher tiers include unlimited family access. Additional dashboards are €2.99/month each."
    },
    {
      question: "What happens if the internet goes down?",
      answer: "Most devices have cellular backup connectivity (included in your plan). The SOS pendant and Vivago watch can still send emergency alerts even without WiFi. We also offer battery backup recommendations for your router."
    },
    {
      question: "Are the devices waterproof?",
      answer: "The SOS pendant and Vivago watch are water-resistant (IPX7 rated), safe for showering. Other devices like medication dispensers and sleep monitors should be kept in dry areas."
    },
    {
      question: "How long do device batteries last?",
      answer: "Battery life varies: SOS pendant (up to 5 years), Vivago watch (3-5 days per charge), medication dispenser (plugged in), BBrain monitor (plugged in). Low battery alerts are sent automatically to you and our nurses."
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Care Conneqt
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-background border-2 border-border rounded-lg px-6 data-[state=open]:border-secondary"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
