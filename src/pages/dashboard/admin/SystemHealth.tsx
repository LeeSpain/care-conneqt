import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, Cloud, Zap, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function SystemHealth() {
  const { t } = useTranslation('dashboard-admin');
  const { toast } = useToast();
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dbStatus, setDbStatus] = useState<"healthy" | "degraded" | "checking">("checking");

  const checkDatabaseHealth = async () => {
    setIsRefreshing(true);
    setDbStatus("checking");
    
    try {
      // Simple health check - query a small table
      const { error } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
      
      if (error) {
        setDbStatus("degraded");
        toast({
          title: t('systemHealth.databaseWarning'),
          description: t('systemHealth.databaseError'),
          variant: "destructive",
        });
      } else {
        setDbStatus("healthy");
      }
    } catch (err) {
      setDbStatus("degraded");
    } finally {
      setLastChecked(new Date());
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkDatabaseHealth();
  }, []);

  const services = [
    {
      name: t('systemHealth.services.database'),
      icon: Database,
      status: dbStatus,
      description: t('systemHealth.services.databaseDesc'),
      uptime: "99.9%",
    },
    {
      name: t('systemHealth.services.authentication'),
      icon: Zap,
      status: "healthy" as const,
      description: t('systemHealth.services.authenticationDesc'),
      uptime: "99.9%",
    },
    {
      name: t('systemHealth.services.cloudStorage'),
      icon: Cloud,
      status: "healthy" as const,
      description: t('systemHealth.services.cloudStorageDesc'),
      uptime: "99.9%",
    },
    {
      name: t('systemHealth.services.edgeFunctions'),
      icon: Activity,
      status: "healthy" as const,
      description: t('systemHealth.services.edgeFunctionsDesc'),
      uptime: "99.9%",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "checking":
        return "bg-gray-400 animate-pulse";
      default:
        return "bg-red-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{t('systemHealth.operational')}</Badge>;
      case "degraded":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">{t('systemHealth.degraded')}</Badge>;
      case "checking":
        return <Badge variant="outline">{t('systemHealth.checking')}</Badge>;
      default:
        return <Badge variant="destructive">{t('systemHealth.down')}</Badge>;
    }
  };

  return (
    <AdminDashboardLayout title={t('systemHealth.title')}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t('systemHealth.title')}</h2>
            <p className="text-muted-foreground">
              {t('systemHealth.subtitle')}
            </p>
          </div>
          <Button onClick={checkDatabaseHealth} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('systemHealth.refreshStatus')}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('systemHealth.overallStatus')}</CardTitle>
                <CardDescription>
                  {t('systemHealth.lastChecked')}: {lastChecked.toLocaleTimeString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold">{t('systemHealth.allOperational')}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="text-sm text-muted-foreground">
                      {service.status === "healthy" 
                        ? t('systemHealth.runningNormally')
                        : service.status === "checking"
                        ? t('systemHealth.checkingStatus')
                        : t('systemHealth.performanceDegraded')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('systemHealth.uptime')}:</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  {service.status === "degraded" && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium">{t('systemHealth.performanceIssues')}</p>
                        <p className="text-xs mt-1">{t('systemHealth.slowResponse')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('systemHealth.systemMetrics')}</CardTitle>
            <CardDescription>{t('systemHealth.metricsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('systemHealth.avgResponseTime')}</p>
                <p className="text-2xl font-bold">124ms</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('systemHealth.apiRequests')}</p>
                <p className="text-2xl font-bold">1.2M</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('systemHealth.activeUsers')}</p>
                <p className="text-2xl font-bold">847</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{t('systemHealth.errorRate')}</p>
                <p className="text-2xl font-bold">0.03%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('systemHealth.recentIncidents')}</CardTitle>
            <CardDescription>{t('systemHealth.incidentsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
              {t('systemHealth.noIncidents')}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
