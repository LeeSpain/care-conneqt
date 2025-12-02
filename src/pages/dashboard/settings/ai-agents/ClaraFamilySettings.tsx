import { Users } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';

export default function ClaraFamilySettings() {
  return (
    <AgentSettingsPage
      agentName="clara-family"
      title="Clara (Family) Configuration"
      subtitle="Support AI for Family Carers"
      icon={Users}
      iconColorClass="text-fuchsia-500"
      gradientClass="bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Family Support Settings</h4>
          <p className="text-sm text-muted-foreground">
            Clara (Family) helps family carers understand their loved one's care, explains health metrics,
            and provides reassurance. Clinical concerns are handed off to Ineke for professional guidance.
          </p>
        </div>
      }
    />
  );
}
