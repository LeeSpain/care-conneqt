import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MemberProfileProps {
  memberName: string;
}

export const MemberProfile = ({ memberName }: MemberProfileProps) => {
  const { t } = useTranslation('dashboard');
  
  return (
    <Card className="border-2">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-border">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {memberName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{memberName}</h2>
                <p className="text-sm text-muted-foreground">{t('member.memberId')} #CC-2024-0156</p>
              </div>
              <Badge className="bg-secondary/10 text-secondary text-sm px-3 py-1">
                {t('status.active')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t('member.age')}</span>
                <span className="font-medium text-foreground">78 {t('member.years')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t('member.contact')}</span>
                <span className="font-medium text-foreground">+44 7700 900123</span>
              </div>
              <div className="flex items-start gap-2 text-sm col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground">{t('member.address')} </span>
                  <span className="font-medium text-foreground">
                    45 Oak Street, London, SW1A 1AA
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                {t('member.emergencyContact')}
              </Button>
              <Button variant="outline" size="sm">
                {t('member.viewFullProfile')}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-secondary">98%</p>
              <p className="text-xs text-muted-foreground">{t('member.healthScore')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">4</p>
              <p className="text-xs text-muted-foreground">{t('member.activeDevices')}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">3 {t('member.months')}</p>
              <p className="text-xs text-muted-foreground">{t('member.memberSince')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};