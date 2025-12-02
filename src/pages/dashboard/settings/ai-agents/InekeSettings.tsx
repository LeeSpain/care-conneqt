import { HeartPulse } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function InekeSettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="ineke"
      title={t('aiAgents.agents.ineke.title')}
      subtitle={t('aiAgents.agents.ineke.subtitle')}
      icon={HeartPulse}
      iconColorClass="text-emerald-500"
      gradientClass="bg-gradient-to-br from-emerald-500/20 to-teal-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('aiAgents.agents.ineke.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.ineke.settingsDescription')}
          </p>
        </div>
      }
    />
  );
}
