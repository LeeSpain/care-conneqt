import { useTranslation } from 'react-i18next';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';

export default function NurseMessages() {
  const { t } = useTranslation('messaging');

  return (
    <NurseDashboardLayout title={t('title', 'Messages')}>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingLayout 
          contextType="nurse"
          allowedRoles={['member', 'family_carer', 'admin', 'facility_admin']}
        />
      </div>
    </NurseDashboardLayout>
  );
}
