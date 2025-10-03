import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const InstitutionalFAQ = () => {
  const faqs = [
    {
      question: "What contract flexibility do you offer?",
      answer: "We offer pilot programs (3-6 months), annual agreements (12 months), preferred partnerships (24 months), and enterprise partnerships (36 months). Each option provides different pricing tiers and benefits. Pilot programs are perfect for testing the system before full deployment, while longer commitments unlock better pricing and additional services like dedicated account management."
    },
    {
      question: "How long does implementation take?",
      answer: "Implementation timeline varies by organization size. Small facilities (5-25 residents) can be fully deployed in 2-3 weeks. Medium to large facilities typically take 4-6 weeks including staff training and system integration. Enterprise deployments with custom integrations may take 2-3 months. We offer phased rollouts to minimize disruption and ensure smooth adoption."
    },
    {
      question: "What training and support is included?",
      answer: "All packages include comprehensive onboarding with video tutorials, user guides, and live training sessions for staff. Ongoing support includes email and phone assistance, with priority response times for larger contracts. Enterprise clients receive dedicated account managers and quarterly business reviews. Custom training programs can be arranged for specific workflows or compliance requirements."
    },
    {
      question: "How does pricing work?",
      answer: "Pricing is volume-based and scales with the number of residents or employees covered. Rates decrease as volume increases, making larger deployments more cost-effective per unit. Pricing also varies by contract length, with longer commitments receiving better rates. We provide custom quotes based on your specific needs, including any integrations, white-labeling, or custom features. Contact us for a detailed quote."
    },
    {
      question: "Can we start with a pilot program?",
      answer: "Yes! Pilot programs are an excellent way to validate Care Conneqt with a small group (typically 5-15 residents) before full deployment. Pilots run for 3-6 months and include full platform access, dedicated implementation support, and performance reporting. This allows you to measure outcomes, gather staff feedback, and secure stakeholder buy-in. Pilot programs can be expanded into full agreements with credit toward your initial investment."
    },
    {
      question: "What data do you collect and who owns it?",
      answer: "We collect health monitoring data, alert information, and usage analytics to provide our service. All data is encrypted, GDPR-compliant, and stored in UK data centers. Your organization retains full ownership of all resident data. You can export your data at any time and request complete deletion if you discontinue service. We never share or sell data to third parties. Detailed data processing agreements are provided during contracting."
    },
    {
      question: "How does it integrate with our existing systems?",
      answer: "Care Conneqt offers RESTful APIs and pre-built integrations with major care management platforms (Person Centred Software, Care Vision, etc.), EHR/EMR systems, and local authority platforms. We support FHIR and HL7 standards for healthcare data exchange. Custom integrations can be developed for Enterprise clients. Our technical team will work with your IT department to ensure smooth integration with your existing workflows."
    },
    {
      question: "Is white-labeling available?",
      answer: "Yes, white-labeling is available for Enterprise-tier clients (typically 500+ residents), insurance providers, and multi-site operators. White-label options include complete rebranding with your logo, colors, and domain name across all user-facing interfaces including mobile apps, web portals, and communications. This allows you to offer Care Conneqt as your own proprietary solution. White-label deployments include dedicated infrastructure and custom terms."
    },
    {
      question: "What happens if we need to scale up or down?",
      answer: "Our platform is designed for flexible scaling. You can add or remove residents/devices monthly as your census changes, with pricing adjusted accordingly. For significant changes (e.g., acquiring a new facility), we can modify agreements mid-term. Contract minimums apply, but we work with you to accommodate organizational changes. Scaling discussions are part of regular business reviews with your account team."
    },
    {
      question: "What compliance and security measures are in place?",
      answer: "Care Conneqt is fully GDPR compliant with ISO 27001, SOC 2 Type II certifications, and Cyber Essentials Plus. We maintain comprehensive audit trails, use AES-256 encryption for data at rest and TLS 1.3 for data in transit, and conduct annual penetration testing. Our platform supports CQC requirements with built-in reporting tools. We maintain 99.9% uptime SLA with UK-based data centers, daily encrypted backups, and disaster recovery protocols."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Common questions from organizations evaluating Care Conneqt for enterprise deployment.
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
              Have more questions? Our enterprise team is here to help.
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="#contact-form">Contact Enterprise Team</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
