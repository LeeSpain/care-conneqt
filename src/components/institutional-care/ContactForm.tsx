import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Mail, Phone, User, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactForm = () => {
  const { t } = useTranslation('institutional-care');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    contactName: '',
    email: '',
    phone: '',
    residentCount: '',
    agreementLength: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Connect to backend endpoint
    console.log('Form submitted:', formData);
    
    toast({
      title: "Request Received!",
      description: "Our team will contact you within 1 business day.",
    });

    // Reset form
    setFormData({
      organizationName: '',
      organizationType: '',
      contactName: '',
      email: '',
      phone: '',
      residentCount: '',
      agreementLength: '',
      message: ''
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('contact.subtitle')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Request a Demo & Custom Quote</CardTitle>
              <CardDescription>
                Complete the form below and our enterprise team will contact you within 1 business day 
                to schedule a demo and discuss your specific requirements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Organization Name *
                      </div>
                    </Label>
                    <Input
                      id="organizationName"
                      value={formData.organizationName}
                      onChange={(e) => handleChange('organizationName', e.target.value)}
                      required
                      placeholder="Your care home or organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select
                      value={formData.organizationType}
                      onValueChange={(value) => handleChange('organizationType', value)}
                      required
                    >
                      <SelectTrigger id="organizationType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="care_home">Care Home / Facility</SelectItem>
                        <SelectItem value="municipality">Municipality / Council</SelectItem>
                        <SelectItem value="insurance">Insurance Provider</SelectItem>
                        <SelectItem value="corporate">Corporate / Employer</SelectItem>
                        <SelectItem value="care_group">Care Group (Multi-site)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Your Name *
                      </div>
                    </Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleChange('contactName', e.target.value)}
                      required
                      placeholder="Full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </div>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      placeholder="your.email@organization.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </div>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+44 20 1234 5678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residentCount">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Number of Residents/Employees *
                      </div>
                    </Label>
                    <Select
                      value={formData.residentCount}
                      onValueChange={(value) => handleChange('residentCount', value)}
                      required
                    >
                      <SelectTrigger id="residentCount">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-25">5-25</SelectItem>
                        <SelectItem value="26-50">26-50</SelectItem>
                        <SelectItem value="51-100">51-100</SelectItem>
                        <SelectItem value="101-250">101-250</SelectItem>
                        <SelectItem value="251-500">251-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="agreementLength">Preferred Agreement Length</Label>
                    <Select
                      value={formData.agreementLength}
                      onValueChange={(value) => handleChange('agreementLength', value)}
                    >
                      <SelectTrigger id="agreementLength">
                        <SelectValue placeholder="Select preferred term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pilot">Pilot Program (3-6 months)</SelectItem>
                        <SelectItem value="12">12 Months</SelectItem>
                        <SelectItem value="24">24 Months (Preferred)</SelectItem>
                        <SelectItem value="36">36 Months (Maximum Value)</SelectItem>
                        <SelectItem value="unsure">Not Sure / Discuss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message">Tell Us About Your Needs</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="What challenges are you trying to solve? Any specific requirements or questions?"
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90">
                  {t('contact.submit')}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to be contacted by Care Conneqt about our enterprise solutions. 
                  We respect your privacy and will never share your information with third parties.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
