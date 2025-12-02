import { Brain } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';

export default function LeeSettings() {
  return (
    <AgentSettingsPage
      agentName="lee-the-brain"
      title="LEE The Brain Configuration"
      subtitle="Master AI Orchestrator"
      icon={Brain}
      iconColorClass="text-amber-500"
      gradientClass="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
      specificSettings={
        <div className="pt-4 border-t space-y-3">
          <h4 className="font-semibold">Super Admin Settings</h4>
          <p className="text-sm text-muted-foreground">
            LEE The Brain is the master AI orchestrator with full system access. LEE can query all other agents,
            access system analytics, and provide executive-level insights. Restricted to admin users only.
          </p>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ LEE has elevated permissions and can access all data across the platform.
              Configure with care and ensure proper audit logging is enabled.
            </p>
          </div>
        </div>
      }
    />
  );
}
