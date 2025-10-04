import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  period: string;
  date: string;
  type: 'weekly' | 'monthly';
}

export const HealthReports = () => {
  const reports: Report[] = [
    {
      id: '1',
      title: 'Weekly Health Summary',
      period: 'Week of Jan 1-7, 2024',
      date: 'Jan 8, 2024',
      type: 'weekly'
    },
    {
      id: '2',
      title: 'Monthly Health Report',
      period: 'December 2023',
      date: 'Jan 1, 2024',
      type: 'monthly'
    },
    {
      id: '3',
      title: 'Weekly Health Summary',
      period: 'Week of Dec 25-31, 2023',
      date: 'Jan 1, 2024',
      type: 'weekly'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Health Reports
          </CardTitle>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Trends
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{report.title}</h4>
                <p className="text-xs text-muted-foreground">{report.period}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{report.date}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button variant="outline" className="w-full mt-2">
          View All Reports
        </Button>
      </CardContent>
    </Card>
  );
};