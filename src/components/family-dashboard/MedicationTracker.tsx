import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, Clock, CheckCircle } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  taken: boolean;
}

export const MedicationTracker = () => {
  const medications: Medication[] = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextDose: '09:00 AM',
      taken: true
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextDose: '06:00 PM',
      taken: false
    },
    {
      id: '3',
      name: 'Aspirin',
      dosage: '75mg',
      frequency: 'Once daily',
      nextDose: '09:00 AM',
      taken: true
    }
  ];

  const takenCount = medications.filter(m => m.taken).length;
  const adherenceRate = Math.round((takenCount / medications.length) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Medication Tracker
          </CardTitle>
          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
            {adherenceRate}% adherence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Today's Progress</p>
              <p className="text-2xl font-bold text-secondary">
                {takenCount} / {medications.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`p-4 rounded-lg border transition-all ${
                med.taken
                  ? 'bg-secondary/5 border-secondary/20'
                  : 'border-border hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{med.name}</h4>
                    {med.taken && (
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{med.dosage} • {med.frequency}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Next dose: {med.nextDose}</span>
                  </div>
                </div>
                <Badge variant={med.taken ? 'default' : 'outline'} className={
                  med.taken ? 'bg-secondary/10 text-secondary' : ''
                }>
                  {med.taken ? 'Taken' : 'Pending'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};