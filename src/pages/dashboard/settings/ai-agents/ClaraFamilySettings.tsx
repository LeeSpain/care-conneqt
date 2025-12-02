import { Users } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function ClaraFamilySettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="clara-family"
      title={t('aiAgents.agents.claraFamily.title')}
      subtitle={t('aiAgents.agents.claraFamily.subtitle')}
      icon={Users}
      iconColorClass="text-fuchsia-500"
      gradientClass="bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('aiAgents.agents.claraFamily.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.claraFamily.settingsDescription')}
          </p>
        </div>
      }
    />
  );
}
