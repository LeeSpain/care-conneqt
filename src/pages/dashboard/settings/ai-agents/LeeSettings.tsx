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
      iconColorClass="text-amber-500"
      gradientClass="bg-gradient-to-br from-amber-500/20 to-orange-500/20"
      specificSettings={
        <div className="pt-4 border-t space-y-3">
          <h4 className="font-semibold">{t('aiAgents.agents.lee.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.lee.settingsDescription')}
          </p>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {t('aiAgents.agents.lee.warning')}
            </p>
          </div>
        </div>
      }
    />
  );
}
