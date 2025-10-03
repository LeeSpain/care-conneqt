import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function MemberOnboarding() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', postalCode: '', country: 'GB' });
  const [emergency, setEmergency] = useState({ name: '', phone: '', relationship: '' });
  const [medical, setMedical] = useState({ conditions: '', medications: '', allergies: '' });
  const [selectedTier, setSelectedTier] = useState('essential');

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Create member record
      const { error: memberError } = await supabase.from('members').insert({
        user_id: user.id,
        date_of_birth: dateOfBirth,
        address_line1: address.line1,
        address_line2: address.line2,
        city: address.city,
        postal_code: address.postalCode,
        country: address.country,
        emergency_contact_name: emergency.name,
        emergency_contact_phone: emergency.phone,
        emergency_contact_relationship: emergency.relationship,
        medical_conditions: medical.conditions.split(',').map(s => s.trim()).filter(Boolean),
        medications: medical.medications.split(',').map(s => s.trim()).filter(Boolean),
        allergies: medical.allergies.split(',').map(s => s.trim()).filter(Boolean),
        subscription_tier: selectedTier,
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      });

      if (memberError) throw memberError;

      // Update profile onboarding status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_completed: true,
          phone: phone 
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      await refreshProfile();
      toast.success('Welcome to Care Conneqt!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>Welcome to Care Conneqt</CardTitle>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <div>
                <Label htmlFor="line1">Address Line 1</Label>
                <Input
                  id="line1"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                <Input
                  id="line2"
                  value={address.line2}
                  onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emergency Contact</h3>
              <div>
                <Label htmlFor="emName">Contact Name</Label>
                <Input
                  id="emName"
                  value={emergency.name}
                  onChange={(e) => setEmergency({ ...emergency, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emPhone">Contact Phone</Label>
                <Input
                  id="emPhone"
                  type="tel"
                  value={emergency.phone}
                  onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emRel">Relationship</Label>
                <Input
                  id="emRel"
                  value={emergency.relationship}
                  onChange={(e) => setEmergency({ ...emergency, relationship: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Information</h3>
              <div>
                <Label htmlFor="conditions">Medical Conditions (comma-separated)</Label>
                <Textarea
                  id="conditions"
                  value={medical.conditions}
                  onChange={(e) => setMedical({ ...medical, conditions: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. Diabetes, Hypertension"
                />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications (comma-separated)</Label>
                <Textarea
                  id="medications"
                  value={medical.medications}
                  onChange={(e) => setMedical({ ...medical, medications: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. Metformin, Lisinopril"
                />
              </div>
              <div>
                <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                <Textarea
                  id="allergies"
                  value={medical.allergies}
                  onChange={(e) => setMedical({ ...medical, allergies: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. Penicillin, Peanuts"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Choose Your Plan</h3>
              <p className="text-sm text-muted-foreground">Start with a 14-day free trial</p>
              <div className="grid gap-4">
                {['essential', 'plus', 'premium'].map((tier) => (
                  <Card
                    key={tier}
                    className={`cursor-pointer transition-all ${
                      selectedTier === tier ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedTier(tier)}
                  >
                    <CardContent className="pt-6">
                      <h4 className="font-bold capitalize mb-2">{tier} Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        {tier === 'essential' && '£99/month - Basic monitoring'}
                        {tier === 'plus' && '£149/month - Enhanced features'}
                        {tier === 'premium' && '£199/month - Full service'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Device Setup</h3>
              <p className="text-muted-foreground">
                You can configure your monitoring devices later from your dashboard.
              </p>
              <Card className="bg-muted">
                <CardContent className="pt-6">
                  <p className="text-sm">
                    Compatible devices: Vivago Watch, Dosell Smart Dispenser, BBrain Sensor
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            {step < totalSteps ? (
              <Button onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading} className="ml-auto">
                {loading ? 'Completing...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
