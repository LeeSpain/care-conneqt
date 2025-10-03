import { Check, X, Sparkles } from "lucide-react";

export const ComparisonTable = () => {
  const comparisons = [
    {
      feature: "Monthly Cost",
      traditional: "€2,000-4,000",
      careHome: "€3,000-6,000",
      careConneqt: "€49.99-159.99",
      highlight: true
    },
    {
      feature: "24/7 Coverage",
      traditional: false,
      careHome: true,
      careConneqt: true
    },
    {
      feature: "Maintain Independence",
      traditional: true,
      careHome: false,
      careConneqt: true,
      highlight: true
    },
    {
      feature: "AI Monitoring",
      traditional: false,
      careHome: false,
      careConneqt: true
    },
    {
      feature: "Family Dashboard Access",
      traditional: "Limited",
      careHome: "Scheduled Visits",
      careConneqt: "24/7 Real-time",
      highlight: true
    },
    {
      feature: "Nurse-Led Care",
      traditional: "In-person only",
      careHome: "On-site staff",
      careConneqt: "Remote + Emergency"
    },
    {
      feature: "Setup Time",
      traditional: "Weeks",
      careHome: "Months (waiting list)",
      careConneqt: "3-5 Days",
      highlight: true
    }
  ];

  const renderValue = (value: boolean | string, isCareConneqt: boolean = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <div className={`inline-flex p-2 rounded-full ${isCareConneqt ? 'bg-secondary/10' : 'bg-muted'}`}>
          <Check className={`h-5 w-5 ${isCareConneqt ? 'text-secondary' : 'text-foreground'}`} />
        </div>
      ) : (
        <div className="inline-flex p-2 rounded-full bg-muted">
          <X className="h-5 w-5 text-muted-foreground/40" />
        </div>
      );
    }
    return (
      <span className={`text-sm leading-tight ${isCareConneqt ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
        {value}
      </span>
    );
  };

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Side-by-Side Comparison
          </div>
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Why Choose Care Conneqt?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how we compare to traditional care options
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            <div className="p-4">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Feature
              </span>
            </div>
            <div className="p-4 text-center rounded-t-xl bg-background/50 border border-b-0 border-border/50">
              <span className="text-sm font-semibold">Traditional<br />In-Home Care</span>
            </div>
            <div className="p-4 text-center rounded-t-xl bg-background/50 border border-b-0 border-border/50">
              <span className="text-sm font-semibold">Care<br />Home</span>
            </div>
            <div className="p-4 text-center rounded-t-xl bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-b-0 border-secondary/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-secondary text-white text-xs font-bold">
                Best Value
              </div>
              <span className="text-sm font-bold text-secondary">Care<br />Conneqt</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="space-y-0">
            {comparisons.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-4 gap-3 group ${
                  idx === comparisons.length - 1 ? '' : ''
                }`}
              >
                <div className={`p-4 flex items-center ${row.highlight ? 'font-semibold' : ''}`}>
                  <span className="text-sm">{row.feature}</span>
                </div>
                
                <div className={`p-4 flex items-center justify-center bg-background/50 border-x border-border/50 ${
                  idx === comparisons.length - 1 ? 'rounded-bl-xl border-b' : 'border-b-0'
                }`}>
                  {renderValue(row.traditional)}
                </div>
                
                <div className={`p-4 flex items-center justify-center bg-background/50 border-x border-border/50 ${
                  idx === comparisons.length - 1 ? 'border-b' : 'border-b-0'
                }`}>
                  {renderValue(row.careHome)}
                </div>
                
                <div className={`p-4 flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5 border-2 border-x-secondary/30 ${
                  idx === comparisons.length - 1 ? 'rounded-br-xl border-b-secondary/30' : 'border-b-0'
                } ${row.highlight ? 'bg-secondary/10' : ''} group-hover:bg-secondary/10 transition-colors`}>
                  {renderValue(row.careConneqt, true)}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              <strong className="text-secondary">Up to 97% cost savings</strong> compared to traditional care options
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
