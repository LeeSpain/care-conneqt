import { Users } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';

export default function ClaraMemberSettings() {
  return (
    <AgentSettingsPage
      agentName="clara-member"
      title="Clara (Member) Configuration"
      subtitle="Personal Companion AI for Members"
      icon={Users}
      iconColorClass="text-purple-500"
      gradientClass="bg-gradient-to-br from-purple-500/20 to-violet-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Member-Specific Settings</h4>
          <p className="text-sm text-muted-foreground">
            Clara (Member) provides daily check-ins, wellness support, and medication reminders.
            Medical questions are automatically handed off to Ineke for clinical review.
          </p>
        </div>
      }
    />
  );
}
