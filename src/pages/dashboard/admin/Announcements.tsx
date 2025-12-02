import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, Plus, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Announcements() {
  const { t } = useTranslation('dashboard-admin');

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["platform-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("platform_announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <AdminDashboardLayout title={t('announcements.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('announcements.title')}</h2>
            <p className="text-muted-foreground">
              {t('announcements.subtitle')}
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('announcements.createButton')}
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Card className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ) : announcements && announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Megaphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle>{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {announcement.published_at 
                            ? new Date(announcement.published_at).toLocaleDateString()
                            : t('announcements.draft')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? t('announcements.active') : t('announcements.inactive')}
                      </Badge>
                      <Badge variant="outline">
                        {announcement.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {announcement.content}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm">{t('announcements.edit')}</Button>
                    <Button variant="ghost" size="sm">{t('announcements.viewDetails')}</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">{t('announcements.noAnnouncements')}</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('announcements.createFirst')}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
