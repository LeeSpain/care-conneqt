import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Users, Building, Heart, Megaphone } from 'lucide-react';
import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { MessagingLayout } from '@/components/messaging/MessagingLayout';
import { BroadcastDialog } from '@/components/messaging/BroadcastDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminMessages() {
  const { t } = useTranslation('messaging');
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getRoleFilter = () => {
    switch (activeTab) {
      case 'staff':
        return ['nurse', 'admin', 'facility_admin', 'company_admin', 'insurance_admin'];
      case 'members':
        return ['member'];
      case 'families':
        return ['family_carer'];
      default:
        return undefined;
    }
  };

  return (
    <AdminDashboardLayout title={t('title', 'Messages')}>
      <div className="space-y-4">
        {/* Header with actions */}
        <div className="flex items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" className="gap-2">
                  <Radio className="h-4 w-4" />
                  {t('tabs.all', 'All')}
                </TabsTrigger>
                <TabsTrigger value="staff" className="gap-2">
                  <Building className="h-4 w-4" />
                  {t('tabs.staff', 'Staff')}
                </TabsTrigger>
                <TabsTrigger value="members" className="gap-2">
                  <Heart className="h-4 w-4" />
                  {t('tabs.members', 'Members')}
                </TabsTrigger>
                <TabsTrigger value="families" className="gap-2">
                  <Users className="h-4 w-4" />
                  {t('tabs.families', 'Families')}
                </TabsTrigger>
              </TabsList>
              
              <Button onClick={() => setBroadcastOpen(true)} variant="outline" className="gap-2">
                <Megaphone className="h-4 w-4" />
                {t('broadcast.title', 'Broadcast')}
              </Button>
            </div>
          </Tabs>
        </div>

        {/* Messaging Layout */}
        <div className="h-[calc(100vh-12rem)]">
          <MessagingLayout 
            contextType="admin"
            allowedRoles={getRoleFilter()}
            key={activeTab}
          />
        </div>
      </div>

      <BroadcastDialog
        open={broadcastOpen}
        onOpenChange={setBroadcastOpen}
      />
    </AdminDashboardLayout>
  );
}
