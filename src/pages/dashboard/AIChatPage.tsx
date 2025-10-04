import { DashboardLayout } from '@/components/DashboardLayout';
import { AIGuardianChat } from '@/components/AIGuardianChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Shield, Heart, Clock } from 'lucide-react';

export default function AIChatPage() {
  return (
    <DashboardLayout title="AI Guardian">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIGuardianChat />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                About AI Guardian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your AI Guardian is available 24/7 to answer questions about your health, medications, and care plan.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5" />
                  <p className="text-sm">Private & Secure</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <p className="text-sm">Available 24/7</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                  <p className="text-sm">Personalized to your needs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Ask about your medications</li>
                <li>• Get health tips and reminders</li>
                <li>• Request appointment scheduling</li>
                <li>• Learn about your care plan</li>
                <li>• Report symptoms or concerns</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
