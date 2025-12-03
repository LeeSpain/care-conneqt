import { useTranslation } from 'react-i18next';
import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';

export default function CompanyMessages() {
  const { t } = useTranslation('messaging');

  return (
    <AdminDashboardLayout title={t('title', 'Messages')}>
      <div className="h-[calc(100vh-8rem)]">
        <MessagingLayout 
          contextType="company"
          allowedRoles={['member', 'nurse', 'admin', 'company_admin']}
        />
      </div>
    </AdminDashboardLayout>
  );
}
