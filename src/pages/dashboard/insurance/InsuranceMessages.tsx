import { useTranslation } from 'react-i18next';
import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';

export default function InsuranceMessages() {
  const { t } = useTranslation('messaging');

  return (
    <AdminDashboardLayout title={t('title', 'Messages')}>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingLayout 
          contextType="insurance"
          allowedRoles={['member', 'admin', 'insurance_admin']}
        />
      </div>
    </AdminDashboardLayout>
  );
}
