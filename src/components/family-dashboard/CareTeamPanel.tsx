import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, Video, MessageSquare, UserRound } from 'lucide-react';

export const CareTeamPanel = () => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            Your Assigned Nurse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">SJ</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Sarah Johnson, RN</h4>
              <p className="text-sm text-muted-foreground">Senior Care Nurse</p>
              <p className="text-xs text-muted-foreground mt-1">12+ years experience</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Video className="h-4 w-4 mr-2" />
              Schedule Call
            </Button>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Next Check-in</p>
            <p className="text-sm font-medium text-foreground">Tomorrow, 2:00 PM</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            24/7 Call Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
            <p className="text-sm text-muted-foreground mb-2">Always Available</p>
            <p className="text-2xl font-bold text-secondary">0800 123 4567</p>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg">
              <Phone className="h-5 w-5 mr-2" />
              Call Now
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Average response time: &lt;30 seconds
            </p>
          </div>

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recent calls:</span>
              <span className="font-medium text-foreground">2 this week</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last contact:</span>
              <span className="font-medium text-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};