import { Users } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function ClaraMemberSettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="clara-member"
      title={t('aiAgents.agents.claraMember.title')}
      subtitle={t('aiAgents.agents.claraMember.subtitle')}
      icon={Users}
      iconColorClass="text-violet-500"
      gradientClass="bg-gradient-to-br from-violet-500/20 to-purple-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('aiAgents.agents.claraMember.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.claraMember.settingsDescription')}
          </p>
        </div>
      }
    />
  );
}
