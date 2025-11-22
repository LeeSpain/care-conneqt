import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Droplet, Weight, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  data: Array<{ time: string; value: number }>;
}

const MetricCard = ({ icon, label, value, unit, trend, data }: MetricCardProps) => {
  const trendColor = trend === 'up' ? 'text-secondary' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {icon}
            </div>
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
          </div>
          <TrendingUp className={`h-4 w-4 ${trendColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{unit}</p>
          </div>
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const HealthMonitoring = () => {
  const { t } = useTranslation('dashboard');
  
  const heartRateData = [
    { time: '00:00', value: 68 },
    { time: '04:00', value: 65 },
    { time: '08:00', value: 72 },
    { time: '12:00', value: 75 },
    { time: '16:00', value: 70 },
    { time: '20:00', value: 72 },
  ];

  const bloodPressureData = [
    { time: 'Mon', value: 120 },
    { time: 'Tue', value: 118 },
    { time: 'Wed', value: 122 },
    { time: 'Thu', value: 119 },
    { time: 'Fri', value: 121 },
    { time: 'Sat', value: 120 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('components.healthMonitoring.title')}</h2>
        <p className="text-muted-foreground">{t('components.healthMonitoring.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={<Heart className="h-4 w-4" />}
          label={t('components.healthMonitoring.heartRate')}
          value="72"
          unit={t('components.healthMonitoring.bpm')}
          trend="stable"
          data={heartRateData}
        />
        <MetricCard
          icon={<Droplet className="h-4 w-4" />}
          label={t('components.healthMonitoring.bloodPressure')}
          value="120/80"
          unit={t('components.healthMonitoring.mmHg')}
          trend="stable"
          data={bloodPressureData}
        />
        <MetricCard
          icon={<Weight className="h-4 w-4" />}
          label={t('components.healthMonitoring.weight')}
          value="68.5"
          unit={t('components.healthMonitoring.kg')}
          trend="down"
          data={heartRateData}
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label={t('components.healthMonitoring.stepsToday')}
          value="2,847"
          unit={t('components.healthMonitoring.steps')}
          trend="up"
          data={heartRateData}
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label={t('components.healthMonitoring.sleepQuality')}
          value="7.5"
          unit={t('components.healthMonitoring.hoursUnit')}
          trend="stable"
          data={heartRateData}
        />
        <MetricCard
          icon={<Activity className="h-4 w-4" />}
          label={t('components.healthMonitoring.activityLevel')}
          value={t('components.healthMonitoring.good')}
          unit={`${t('components.healthMonitoring.active')} 4h 23m`}
          trend="up"
          data={heartRateData}
        />
      </div>
    </div>
  );
};