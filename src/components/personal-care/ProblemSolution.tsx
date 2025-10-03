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

        {/* Arrow Transition */}
        <div className="flex justify-center mb-12 animate-fade-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-coral via-secondary to-lilac rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-secondary/20">
              <ArrowRight className="h-8 w-8 text-secondary animate-pulse" />
            </div>
          </div>
        </div>

        {/* Solution - Hero Style */}
        <div className="max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/5 via-primary/5 to-lilac/5 backdrop-blur-sm border border-secondary/20">
            {/* Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-coral/10 to-lilac/10 rounded-full blur-3xl" />
            
            {/* Content */}
            <div className="relative p-12 md:p-16 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-secondary font-semibold">The Care Conneqt Solution</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-primary leading-tight">
                Bridging the Gap Between<br />
                <span className="text-secondary">Independence and Safety</span>
              </h3>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Affordable, nurse-led remote care that keeps seniors independent at home while 
                giving families peace of mind through real-time monitoring, AI companionship, 
                and 24/7 emergency support.
              </p>

              {/* Key Benefits Pills */}
              <div className="flex flex-wrap justify-center gap-3 pt-6">
                {[
                  { label: 'From €49.99/month', color: 'secondary' },
                  { label: '24/7 Nurse Support', color: 'primary' },
                  { label: 'AI-Powered Care', color: 'coral' },
                  { label: 'Family Connected', color: 'lilac' }
                ].map((benefit, idx) => (
                  <div 
                    key={idx}
                    className={`px-5 py-2.5 rounded-full bg-${benefit.color}/10 border border-${benefit.color}/20 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
                  >
                    <span className={`text-${benefit.color} font-semibold text-sm`}>
                      {benefit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative Bottom Line */}
              <div className="flex justify-center pt-8">
                <div className="h-1.5 w-32 bg-gradient-to-r from-coral via-secondary to-lilac rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '600ms' }}>
          {[
            { value: '10,000+', label: 'Families Trust Us', color: 'secondary' },
            { value: '98%', label: 'Satisfaction Rate', color: 'primary' },
            { value: '75%', label: 'Cost Savings vs Care Homes', color: 'coral' },
            { value: '24/7', label: 'Nurse Availability', color: 'lilac' }
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="text-center space-y-2 group cursor-default"
            >
              <div className={`text-4xl font-bold text-${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
