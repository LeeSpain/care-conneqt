import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, DollarSign, ArrowRight } from "lucide-react";

export const ProblemSolution = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: "Worried about elderly parents living alone?",
      description: "Falls, medical emergencies, and daily concerns keep families anxious and constantly checking in.",
      color: "coral"
    },
    {
      icon: Clock,
      title: "Emergency response too slow or impersonal?",
      description: "Traditional alert systems often have delayed responses and lack the personal touch of nurse-led care.",
      color: "lilac"
    },
    {
      icon: DollarSign,
      title: "Expensive in-home care or facility costs?",
      description: "Full-time caregivers cost €2,000-4,000/month. Care homes cost €3,000-6,000/month. There's a better way.",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            The Challenge of Aging at Home
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Families face difficult choices between independence, safety, and affordability
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, idx) => (
            <Card key={idx} className="border-2 hover:border-secondary/50 transition-all">
              <CardContent className="pt-6">
                <div className={`inline-flex p-3 rounded-lg bg-${problem.color}/10 mb-4`}>
                  <problem.icon className={`h-8 w-8 text-${problem.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-secondary bg-secondary/5">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-4">
                <ArrowRight className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold font-['Poppins'] text-center mb-4">
                Care Conneqt Bridges the Gap
              </h3>
              <p className="text-lg text-center text-muted-foreground">
                Affordable, nurse-led remote care that keeps seniors independent at home while 
                giving families peace of mind through real-time monitoring, AI companionship, 
                and 24/7 emergency support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
