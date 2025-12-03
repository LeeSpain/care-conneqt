import { Brain } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function LeeSettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="lee-the-brain"
      title={t('aiAgents.agents.lee.title')}
      subtitle={t('aiAgents.agents.lee.subtitle')}
      icon={Brain}
      iconColorClass="text-white"
      gradientClass="bg-secondary"
      specificSettings={
        <div className="pt-4 border-t space-y-3">
          <h4 className="font-semibold">{t('aiAgents.agents.lee.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.lee.settingsDescription')}
          </p>
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
            <p className="text-xs text-secondary dark:text-secondary">
              {t('aiAgents.agents.lee.warning')}
            </p>
          </div>
        </div>
      }
    />
  );
}
