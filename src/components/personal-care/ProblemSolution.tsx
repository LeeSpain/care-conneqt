import { AlertCircle, Clock, DollarSign, ArrowRight, Sparkles } from "lucide-react";

export const ProblemSolution = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: "Worried about elderly parents living alone?",
      description: "Falls, medical emergencies, and daily concerns keep families anxious and constantly checking in.",
      color: "coral",
      gradient: "from-coral/20 to-coral/5"
    },
    {
      icon: Clock,
      title: "Emergency response too slow or impersonal?",
      description: "Traditional alert systems often have delayed responses and lack the personal touch of nurse-led care.",
      color: "lilac",
      gradient: "from-lilac/20 to-lilac/5"
    },
    {
      icon: DollarSign,
      title: "Expensive in-home care or facility costs?",
      description: "Full-time caregivers cost €2,000-4,000/month. Care homes cost €3,000-6,000/month. There's a better way.",
      color: "secondary",
      gradient: "from-secondary/20 to-secondary/5"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted via-background to-muted" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-coral/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <AlertCircle className="h-4 w-4" />
            The Reality of Aging at Home
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-primary mb-6">
            The Challenge of Aging at Home
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Families face difficult choices between independence, safety, and affordability. 
            The current options leave much to be desired.
          </p>
        </div>

        {/* Problems - Modern Card-less Layout */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          {problems.map((problem, idx) => (
            <div 
              key={idx} 
              className="group relative animate-fade-in hover-scale"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative p-8 space-y-4">
                <div className={`inline-flex p-4 rounded-xl bg-${problem.color}/10 group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className={`h-8 w-8 text-${problem.color}`} />
                </div>
                
                <h3 className="text-xl font-bold font-['Poppins'] leading-tight group-hover:text-primary transition-colors">
                  {problem.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>

                {/* Decorative Line */}
                <div className={`h-1 w-16 bg-${problem.color} rounded-full group-hover:w-full transition-all duration-500`} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
