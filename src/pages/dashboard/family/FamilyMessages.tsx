import { useTranslation } from 'react-i18next';
import { FamilyDashboardLayout } from '@/components/FamilyDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';

export default function FamilyMessages() {
  const { t } = useTranslation('messaging');

  return (
    <FamilyDashboardLayout title={t('title', 'Messages')}>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingLayout 
          allowedRoles={['nurse', 'member', 'admin']}
          contextType="family"
        />
      </div>
    </FamilyDashboardLayout>
  );
}
