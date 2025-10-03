import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export const ComparisonTable = () => {
  const comparisons = [
    {
      feature: "Monthly Cost",
      traditional: "€2,000-4,000",
      careHome: "€3,000-6,000",
      careConneqt: "€49.99-159.99"
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
      careConneqt: true
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
      careConneqt: "24/7 Real-time"
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
      careConneqt: "3-5 Days"
    }
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-6 w-6 text-secondary mx-auto" />
      ) : (
        <X className="h-6 w-6 text-muted-foreground/50 mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Poppins'] text-primary mb-4">
            Why Choose Care Conneqt?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare us with traditional care options
          </p>
        </div>

        <Card className="max-w-5xl mx-auto border-2">
          <CardHeader className="bg-muted">
            <div className="grid grid-cols-4 gap-4">
              <CardTitle className="text-lg">Feature</CardTitle>
              <CardTitle className="text-lg text-center">Traditional<br />In-Home Care</CardTitle>
              <CardTitle className="text-lg text-center">Care<br />Home</CardTitle>
              <CardTitle className="text-lg text-center text-secondary">Care<br />Conneqt</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {comparisons.map((row, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-4 gap-4 p-4 ${
                  idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'
                }`}
              >
                <div className="font-semibold flex items-center">{row.feature}</div>
                <div className="text-center flex items-center justify-center">
                  {renderValue(row.traditional)}
                </div>
                <div className="text-center flex items-center justify-center">
                  {renderValue(row.careHome)}
                </div>
                <div className="text-center flex items-center justify-center font-semibold">
                  {renderValue(row.careConneqt)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
