import { Card, CardContent } from '@/components/ui/card';
import { Heart, Activity, Bell, Pill } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'good' | 'warning' | 'alert';
}

const StatCard = ({ icon, label, value, status }: StatCardProps) => {
  const statusColors = {
    good: 'bg-secondary/10 text-secondary',
    warning: 'bg-coral/10 text-coral',
    alert: 'bg-destructive/10 text-destructive'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-lg ${statusColors[status]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickStatsProps {
  memberName: string;
}

export const QuickStats = ({ memberName }: QuickStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Heart className="h-5 w-5" />}
        label="Heart Rate"
        value="72 bpm"
        status="good"
      />
      <StatCard
        icon={<Activity className="h-5 w-5" />}
        label="Activity Today"
        value="2,847 steps"
        status="good"
      />
      <StatCard
        icon={<Bell className="h-5 w-5" />}
        label="Active Alerts"
        value="0"
        status="good"
      />
      <StatCard
        icon={<Pill className="h-5 w-5" />}
        label="Medications"
        value="3/3 taken"
        status="good"
      />
    </div>
  );
};