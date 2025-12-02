import { useTranslation } from 'react-i18next';
import { FacilityDashboardLayout } from '@/components/FacilityDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';

export default function FacilityMessages() {
  const { t } = useTranslation('messaging');

  return (
    <FacilityDashboardLayout title={t('title', 'Messages')}>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingLayout 
          allowedRoles={['nurse', 'member', 'family_carer', 'admin']}
          contextType="facility"
        />
      </div>
    </FacilityDashboardLayout>
  );
}
