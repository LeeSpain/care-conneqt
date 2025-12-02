import { Building2 } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function IsabellaSettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="isabella"
      title={t('aiAgents.agents.isabella.title')}
      subtitle={t('aiAgents.agents.isabella.subtitle')}
      icon={Building2}
      iconColorClass="text-blue-500"
      gradientClass="bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('aiAgents.agents.isabella.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.isabella.settingsDescription')}
          </p>
        </div>
      }
    />
  );
}
