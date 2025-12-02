import { Building2 } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';

export default function IsabellaSettings() {
  return (
    <AgentSettingsPage
      agentName="isabella"
      title="Isabella Configuration"
      subtitle="Facility Management AI Assistant"
      icon={Building2}
      iconColorClass="text-blue-500"
      gradientClass="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Facility Management Settings</h4>
          <p className="text-sm text-muted-foreground">
            Isabella assists facility and company administrators with staff management, resident oversight,
            compliance reporting, and operational efficiency. Available to facility_admin, company_admin, and insurance_admin roles.
          </p>
        </div>
      }
    />
  );
}
