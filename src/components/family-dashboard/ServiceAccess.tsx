import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Video, 
  MessageSquare, 
  FileText, 
  Settings, 
  ShoppingCart,
  Bot,
  Smartphone
} from 'lucide-react';

export const ServiceAccess = () => {
  const services = [
    {
      icon: Phone,
      title: '24/7 Call Center',
      description: 'Speak to care experts anytime',
      action: 'Call Now',
      variant: 'default' as const
    },
    {
      icon: Video,
      title: 'Video Consultation',
      description: 'Schedule a nurse check-in',
      action: 'Book Call',
      variant: 'outline' as const
    },
    {
      icon: MessageSquare,
      title: 'Message Nurse',
      description: 'Direct message your care team',
      action: 'Send Message',
      variant: 'outline' as const
    },
    {
      icon: Bot,
      title: 'AI Guardian',
      description: 'Chat with AI health assistant',
      action: 'Start Chat',
      variant: 'outline' as const
    },
    {
      icon: FileText,
      title: 'Health Reports',
      description: 'Download monthly reports',
      action: 'View Reports',
      variant: 'outline' as const
    },
    {
      icon: Smartphone,
      title: 'Devices',
      description: 'Manage connected devices',
      action: 'Manage',
      variant: 'outline' as const
    },
    {
      icon: ShoppingCart,
      title: 'Add Services',
      description: 'Upgrade or add devices',
      action: 'Shop Now',
      variant: 'outline' as const
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage preferences',
      action: 'Configure',
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Access Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="hover:shadow-md transition-all border-border">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">
                        {service.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {service.description}
                      </p>
                    </div>
                    <Button variant={service.variant} size="sm" className="w-full">
                      {service.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};