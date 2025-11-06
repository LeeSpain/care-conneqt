import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, LucideIcon } from "lucide-react";
import { useState } from "react";
import { DeviceDetailsModal } from "./DeviceDetailsModal";
import { Link } from "react-router-dom";

interface DeviceCardProps {
  name: string;
  tagline: string;
  description: string;
  price: string;
  features: string[];
  specs: Record<string, string>;
  image: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  popular?: boolean;
}

export function DeviceCard({
  name,
  tagline,
  description,
  price,
  features,
  specs,
  image,
  icon: Icon,
  color,
  gradient,
  popular = false,
}: DeviceCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {popular && (
          <Badge className="absolute top-4 right-4 z-10 bg-secondary text-secondary-foreground">
            Most Popular
          </Badge>
        )}

        {/* Product Image with Care Connect Branding */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Care Connect Badge Overlay */}
          <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/20 shadow-lg">
            <span className="text-xs font-semibold text-primary">Care Connect</span>
          </div>
        </div>

        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-3 mb-2">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold leading-tight mb-1">{name}</CardTitle>
              <CardDescription className={`text-xs font-medium ${color} line-clamp-1`}>
                {tagline}
              </CardDescription>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-primary">{price}</div>
        </CardHeader>

        <CardContent className="p-5 pt-0 flex-1 flex flex-col">
          {/* Top 3 Features */}
          <div className="space-y-2 mb-4 flex-1">
            {features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground leading-snug">{feature}</span>
              </div>
            ))}
            {features.length > 3 && (
              <p className="text-xs text-muted-foreground ml-6">+{features.length - 3} more features</p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2 mt-auto">
            <Button 
              onClick={() => setShowDetails(true)}
              variant="outline" 
              className="w-full"
            >
              View Details
            </Button>
            <Button 
              className="w-full bg-secondary hover:bg-secondary/90" 
              asChild
            >
              <Link to="/auth/signup">Add to Package</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeviceDetailsModal
        open={showDetails}
        onOpenChange={setShowDetails}
        name={name}
        tagline={tagline}
        description={description}
        price={price}
        features={features}
        specs={specs}
        image={image}
        icon={Icon}
        color={color}
        gradient={gradient}
      />
    </>
  );
}
