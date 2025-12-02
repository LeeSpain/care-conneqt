import { MessageSquare } from 'lucide-react';
import { AgentSettingsPage } from '@/components/ai-agents/AgentSettingsPage';
import { useTranslation } from 'react-i18next';

export default function ClaraSettings() {
  const { t } = useTranslation('dashboard-admin');
  
  return (
    <AgentSettingsPage
      agentName="clara"
      title={t('aiAgents.agents.clara.title')}
      subtitle={t('aiAgents.agents.clara.subtitle')}
      icon={MessageSquare}
      iconColorClass="text-purple-500"
      gradientClass="bg-gradient-to-br from-purple-500/20 to-pink-500/20"
      specificSettings={
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">{t('aiAgents.agents.clara.settingsTitle')}</h4>
          <p className="text-sm text-muted-foreground">
            {t('aiAgents.agents.clara.settingsDescription')}
          </p>
        </div>
      }
    />
  );
}
