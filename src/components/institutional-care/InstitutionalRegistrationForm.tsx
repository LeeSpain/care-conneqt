import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Building2, User, Briefcase, FileText, Shield, Send } from 'lucide-react';

export function InstitutionalRegistrationForm() {
  const { t } = useTranslation(['institutional-care', 'common']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Organization Details
    organization_name: '',
    organization_type: '',
    registration_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: 'NL',
    website: '',
    
    // Contact Person
    contact_name: '',
    contact_job_title: '',
    contact_email: '',
    contact_phone: '',
    preferred_contact_method: '',
    best_time_to_contact: '',
    
    // Service Requirements
    resident_count: '',
    employee_count: '',
    service_interests: [] as string[],
    current_systems: '',
    implementation_timeline: '',
    
    // Contract Preferences
    preferred_agreement_length: '',
    budget_range: '',
    procurement_process: '',
    
    // Compliance & Integration
    gdpr_requirements: '',
    ehr_systems: '',
    security_requirements: '',
    additional_notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      service_interests: prev.service_interests.includes(interest)
        ? prev.service_interests.filter(i => i !== interest)
        : [...prev.service_interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to institutional_registrations table
      const { error } = await supabase
        .from('institutional_registrations')
        .insert([{
          ...formData,
          resident_count: formData.resident_count ? parseInt(formData.resident_count) : null,
          employee_count: formData.employee_count ? parseInt(formData.employee_count) : null,
        }]);

      if (error) throw error;

      // Also create a lead for tracking in lead management system
      const leadType = 
        formData.organization_type === 'care_home' ? 'facility' : 
        formData.organization_type === 'insurance' ? 'insurance' : 
        formData.organization_type === 'care_group' ? 'care_company' : 'other';

      await supabase
        .from('leads')
        .insert({
          name: formData.contact_name,
          email: formData.contact_email,
          phone: formData.contact_phone,
          interest_type: 'institutional',
          lead_type: leadType,
          organization_name: formData.organization_name,
          organization_type: formData.organization_type,
          resident_count: formData.resident_count,
          agreement_length: formData.preferred_agreement_length,
          estimated_value: formData.budget_range ? parseFloat(formData.budget_range.split('-')[0]) : null,
          message: formData.additional_notes,
          source_page: '/institutional-care',
          status: 'new',
        });

      toast.success(t('registration.success'));
      // Reset form
      setFormData({
        organization_name: '',
        organization_type: '',
        registration_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'NL',
        website: '',
        contact_name: '',
        contact_job_title: '',
        contact_email: '',
        contact_phone: '',
        preferred_contact_method: '',
        best_time_to_contact: '',
        resident_count: '',
        employee_count: '',
        service_interests: [],
        current_systems: '',
        implementation_timeline: '',
        preferred_agreement_length: '',
        budget_range: '',
        procurement_process: '',
        gdpr_requirements: '',
        ehr_systems: '',
        security_requirements: '',
        additional_notes: '',
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast.error(t('registration.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{t('registration.title')}</h2>
          <p className="text-lg text-muted-foreground">{t('registration.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Organization Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {t('registration.sections.organization')}
                </CardTitle>
                <CardDescription>{t('registration.sections.organizationDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="organization_name">{t('registration.fields.organizationName')} *</Label>
                    <Input
                      id="organization_name"
                      required
                      value={formData.organization_name}
                      onChange={(e) => handleInputChange('organization_name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organization_type">{t('registration.fields.organizationType')} *</Label>
                    <Select value={formData.organization_type} onValueChange={(value) => handleInputChange('organization_type', value)} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="care_home">{t('registration.organizationTypes.careHome')}</SelectItem>
                        <SelectItem value="municipality">{t('registration.organizationTypes.municipality')}</SelectItem>
                        <SelectItem value="insurance">{t('registration.organizationTypes.insurance')}</SelectItem>
                        <SelectItem value="corporate">{t('registration.organizationTypes.corporate')}</SelectItem>
                        <SelectItem value="care_group">{t('registration.organizationTypes.careGroup')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="registration_number">{t('registration.fields.registrationNumber')}</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => handleInputChange('registration_number', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address_line1">{t('registration.fields.address')}</Label>
                    <Input
                      id="address_line1"
                      value={formData.address_line1}
                      onChange={(e) => handleInputChange('address_line1', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">{t('registration.fields.city')}</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="postal_code">{t('registration.fields.postalCode')}</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">{t('registration.fields.website')}</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Person */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('registration.sections.contact')}
                </CardTitle>
                <CardDescription>{t('registration.sections.contactDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_name">{t('registration.fields.contactName')} *</Label>
                    <Input
                      id="contact_name"
                      required
                      value={formData.contact_name}
                      onChange={(e) => handleInputChange('contact_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_job_title">{t('registration.fields.jobTitle')}</Label>
                    <Input
                      id="contact_job_title"
                      value={formData.contact_job_title}
                      onChange={(e) => handleInputChange('contact_job_title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">{t('registration.fields.email')} *</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      required
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_phone">{t('registration.fields.phone')}</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferred_contact_method">{t('registration.fields.preferredContactMethod')}</Label>
                    <Select value={formData.preferred_contact_method} onValueChange={(value) => handleInputChange('preferred_contact_method', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">{t('registration.contactMethods.email')}</SelectItem>
                        <SelectItem value="phone">{t('registration.contactMethods.phone')}</SelectItem>
                        <SelectItem value="either">{t('registration.contactMethods.either')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="best_time_to_contact">{t('registration.fields.bestTimeToContact')}</Label>
                    <Input
                      id="best_time_to_contact"
                      value={formData.best_time_to_contact}
                      onChange={(e) => handleInputChange('best_time_to_contact', e.target.value)}
                      placeholder={t('registration.placeholders.bestTime')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {t('registration.sections.service')}
                </CardTitle>
                <CardDescription>{t('registration.sections.serviceDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resident_count">{t('registration.fields.residentCount')}</Label>
                    <Input
                      id="resident_count"
                      type="number"
                      min="1"
                      value={formData.resident_count}
                      onChange={(e) => handleInputChange('resident_count', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="employee_count">{t('registration.fields.employeeCount')}</Label>
                    <Input
                      id="employee_count"
                      type="number"
                      min="1"
                      value={formData.employee_count}
                      onChange={(e) => handleInputChange('employee_count', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label>{t('registration.fields.serviceInterests')}</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {['monitoring', 'ai_guardian', 'nurse_support', 'device_management', 'family_portal', 'analytics'].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest}`}
                            checked={formData.service_interests.includes(interest)}
                            onCheckedChange={() => handleServiceInterestToggle(interest)}
                          />
                          <label
                            htmlFor={`interest-${interest}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t(`registration.serviceInterests.${interest}`)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="current_systems">{t('registration.fields.currentSystems')}</Label>
                    <Input
                      id="current_systems"
                      value={formData.current_systems}
                      onChange={(e) => handleInputChange('current_systems', e.target.value)}
                      placeholder={t('registration.placeholders.currentSystems')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="implementation_timeline">{t('registration.fields.implementationTimeline')}</Label>
                    <Select value={formData.implementation_timeline} onValueChange={(value) => handleInputChange('implementation_timeline', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">{t('registration.timelines.immediate')}</SelectItem>
                        <SelectItem value="1-3_months">{t('registration.timelines.oneToThree')}</SelectItem>
                        <SelectItem value="3-6_months">{t('registration.timelines.threeToSix')}</SelectItem>
                        <SelectItem value="6-12_months">{t('registration.timelines.sixToTwelve')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('registration.sections.contract')}
                </CardTitle>
                <CardDescription>{t('registration.sections.contractDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_agreement_length">{t('registration.fields.agreementLength')}</Label>
                    <Select value={formData.preferred_agreement_length} onValueChange={(value) => handleInputChange('preferred_agreement_length', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pilot">{t('registration.agreementLengths.pilot')}</SelectItem>
                        <SelectItem value="12_months">{t('registration.agreementLengths.twelve')}</SelectItem>
                        <SelectItem value="24_months">{t('registration.agreementLengths.twentyFour')}</SelectItem>
                        <SelectItem value="36_months">{t('registration.agreementLengths.thirtySix')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="budget_range">{t('registration.fields.budgetRange')}</Label>
                    <Input
                      id="budget_range"
                      value={formData.budget_range}
                      onChange={(e) => handleInputChange('budget_range', e.target.value)}
                      placeholder={t('registration.placeholders.budgetRange')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="procurement_process">{t('registration.fields.procurementProcess')}</Label>
                    <Textarea
                      id="procurement_process"
                      value={formData.procurement_process}
                      onChange={(e) => handleInputChange('procurement_process', e.target.value)}
                      placeholder={t('registration.placeholders.procurement')}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('registration.sections.compliance')}
                </CardTitle>
                <CardDescription>{t('registration.sections.complianceDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gdpr_requirements">{t('registration.fields.gdprRequirements')}</Label>
                    <Textarea
                      id="gdpr_requirements"
                      value={formData.gdpr_requirements}
                      onChange={(e) => handleInputChange('gdpr_requirements', e.target.value)}
                      placeholder={t('registration.placeholders.gdpr')}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ehr_systems">{t('registration.fields.ehrSystems')}</Label>
                    <Input
                      id="ehr_systems"
                      value={formData.ehr_systems}
                      onChange={(e) => handleInputChange('ehr_systems', e.target.value)}
                      placeholder={t('registration.placeholders.ehr')}
                    />
                  </div>

                  <div>
                    <Label htmlFor="security_requirements">{t('registration.fields.securityRequirements')}</Label>
                    <Textarea
                      id="security_requirements"
                      value={formData.security_requirements}
                      onChange={(e) => handleInputChange('security_requirements', e.target.value)}
                      placeholder={t('registration.placeholders.security')}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additional_notes">{t('registration.fields.additionalNotes')}</Label>
                    <Textarea
                      id="additional_notes"
                      value={formData.additional_notes}
                      onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                      placeholder={t('registration.placeholders.notes')}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-6">
              <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[200px]">
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? t('registration.submitting') : t('registration.submit')}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {t('registration.privacyNote')}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
