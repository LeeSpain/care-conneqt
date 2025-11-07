import { useEffect, useState } from 'react';
import { NurseDashboardLayout } from '@/components/NurseDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CallMemberDialog } from '@/components/nurse/CallMemberDialog';
import { MessageMemberDialog } from '@/components/nurse/MessageMemberDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Search, AlertTriangle, Activity, Phone, MessageSquare, 
  SlidersHorizontal, ArrowUpDown, Users, UserCheck, 
  AlertCircle, TrendingUp, Download, Grid, List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Member {
  id: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  date_of_birth: string;
  care_level: string;
  subscription_tier: string;
  subscription_status: string;
  medical_conditions: string[];
  medications: string[];
  mobility_level: string;
  city: string;
  alertCount: number;
  lastContact: string;
  riskScore: number;
}

type SortField = 'name' | 'lastContact' | 'alertCount' | 'riskScore' | 'care_level';
type SortOrder = 'asc' | 'desc';
type ViewMode = 'grid' | 'list';

export default function NurseMembers() {
  const { user } = useAuth();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [careLevelFilter, setCareLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('lastContact');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;

    const { data: assignments } = await supabase
      .from('nurse_assignments')
      .select(`
        member_id,
        assigned_at,
        members:member_id (
          id,
          user_id,
          date_of_birth,
          care_level,
          subscription_tier,
          subscription_status,
          medical_conditions,
          medications,
          mobility_level,
          city,
          profiles:user_id (
            first_name,
            last_name,
            phone,
            email
          )
        )
      `)
      .eq('nurse_id', user.id);

    if (assignments) {
      const memberData = await Promise.all(
        assignments.map(async (assignment: any) => {
          const member = assignment.members;
          
          const { count: alertCount } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('member_id', member.id)
            .in('status', ['new', 'in_progress']);

          const { data: lastActivity } = await supabase
            .from('activity_logs')
            .select('created_at')
            .eq('member_id', member.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Calculate risk score based on multiple factors
          const riskScore = calculateRiskScore(
            member.care_level,
            alertCount || 0,
            member.medical_conditions?.length || 0,
            member.medications?.length || 0
          );

          return {
            ...member,
            alertCount: alertCount || 0,
            lastContact: lastActivity?.created_at || assignment.assigned_at,
            riskScore
          };
        })
      );

      setMembers(memberData);
    }
    setLoading(false);
  };

  const calculateRiskScore = (
    careLevel: string, 
    alertCount: number, 
    conditionsCount: number,
    medicationsCount: number
  ): number => {
    let score = 0;
    
    // Care level weight
    if (careLevel === 'High') score += 40;
    else if (careLevel === 'Medium') score += 20;
    else score += 10;
    
    // Alerts weight (10 points per alert)
    score += Math.min(alertCount * 10, 30);
    
    // Medical complexity (conditions + medications)
    score += Math.min((conditionsCount + medicationsCount) * 2, 30);
    
    return Math.min(score, 100);
  };

  const filteredAndSortedMembers = members
    .filter((member) => {
      // Search filter
      const fullName = `${member.profiles?.first_name} ${member.profiles?.last_name}`.toLowerCase();
      const searchMatch = searchQuery === '' || 
        fullName.includes(searchQuery.toLowerCase()) ||
        member.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Care level filter
      const careLevelMatch = careLevelFilter === 'all' || member.care_level === careLevelFilter;
      
      // Status filter
      let statusMatch = true;
      if (statusFilter === 'critical') statusMatch = member.alertCount >= 3;
      else if (statusFilter === 'attention') statusMatch = member.alertCount >= 1 && member.alertCount < 3;
      else if (statusFilter === 'good') statusMatch = member.alertCount === 0;
      
      return searchMatch && careLevelMatch && statusMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          const nameA = `${a.profiles?.first_name} ${a.profiles?.last_name}`;
          const nameB = `${b.profiles?.first_name} ${b.profiles?.last_name}`;
          comparison = nameA.localeCompare(nameB);
          break;
        case 'lastContact':
          comparison = new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime();
          break;
        case 'alertCount':
          comparison = a.alertCount - b.alertCount;
          break;
        case 'riskScore':
          comparison = a.riskScore - b.riskScore;
          break;
        case 'care_level':
          const levels = { 'High': 3, 'Medium': 2, 'Low': 1 };
          comparison = (levels[a.care_level as keyof typeof levels] || 0) - (levels[b.care_level as keyof typeof levels] || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return 'High Risk';
    if (score >= 40) return 'Medium Risk';
    return 'Low Risk';
  };

  const getStatusColor = (alertCount: number) => {
    if (alertCount >= 3) return 'destructive';
    if (alertCount >= 1) return 'default';
    return 'secondary';
  };

  const getStatusLabel = (alertCount: number) => {
    if (alertCount >= 3) return 'Critical';
    if (alertCount >= 1) return 'Needs Attention';
    return 'Stable';
  };

  const stats = {
    total: members.length,
    critical: members.filter(m => m.alertCount >= 3).length,
    attention: members.filter(m => m.alertCount >= 1 && m.alertCount < 3).length,
    highRisk: members.filter(m => m.riskScore >= 70).length,
  };

  const handleCall = (member: Member) => {
    setSelectedMember(member);
    setCallDialogOpen(true);
  };

  const handleMessage = (member: Member) => {
    setSelectedMember(member);
    setMessageDialogOpen(true);
  };

  return (
    <NurseDashboardLayout title={t('nurse.myMembers')}>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Status</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Need Attention</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.attention}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.highRisk}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={careLevelFilter} onValueChange={setCareLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Care Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Low">Low Care</SelectItem>
              <SelectItem value="Medium">Medium Care</SelectItem>
              <SelectItem value="High">High Care</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="attention">Needs Attention</SelectItem>
              <SelectItem value="good">Stable</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setSortField('name'); setSortOrder('asc'); }}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('name'); setSortOrder('desc'); }}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('lastContact'); setSortOrder('desc'); }}>
                Last Contact (Recent)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('alertCount'); setSortOrder('desc'); }}>
                Most Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('riskScore'); setSortOrder('desc'); }}>
                Highest Risk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('care_level'); setSortOrder('desc'); }}>
                Care Level
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Member List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredAndSortedMembers.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No members found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || careLevelFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : t('nurse.noMembers')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-4' : 'space-y-3'}>
            {filteredAndSortedMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-lg font-semibold">
                              {member.profiles?.first_name} {member.profiles?.last_name}
                            </h3>
                            <Badge variant={getStatusColor(member.alertCount)}>
                              {getStatusLabel(member.alertCount)}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${getRiskColor(member.riskScore)}`} />
                              <span className="text-xs text-muted-foreground">
                                {getRiskLabel(member.riskScore)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.profiles?.email}</p>
                        </div>
                      </div>
                      
                      {/* Member Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground text-xs">Age</p>
                          <p className="font-medium">
                            {member.date_of_birth 
                              ? new Date().getFullYear() - new Date(member.date_of_birth).getFullYear() 
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Care Level</p>
                          <p className="font-medium">{member.care_level || 'Standard'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Active Alerts</p>
                          <p className="font-medium text-red-600">{member.alertCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Last Contact</p>
                          <p className="font-medium">{format(new Date(member.lastContact), 'MMM d')}</p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground text-xs">Location</p>
                          <p className="font-medium truncate">{member.city || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Subscription</p>
                          <p className="font-medium">{member.subscription_tier || 'Standard'}</p>
                        </div>
                      </div>

                      {/* Medical Conditions */}
                      {member.medical_conditions && member.medical_conditions.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-muted-foreground mb-1">Conditions</p>
                          <div className="flex flex-wrap gap-1">
                            {member.medical_conditions.slice(0, 4).map((condition, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                            {member.medical_conditions.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.medical_conditions.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Mobility Info */}
                      {member.mobility_level && (
                        <div className="text-xs text-muted-foreground">
                          <Activity className="h-3 w-3 inline mr-1" />
                          {member.mobility_level}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/dashboard/nurse/members/${member.id}`)}
                        className="whitespace-nowrap"
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCall(member)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMessage(member)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {selectedMember && (
        <>
          <CallMemberDialog 
            open={callDialogOpen}
            onOpenChange={setCallDialogOpen}
            memberName={`${selectedMember.profiles.first_name} ${selectedMember.profiles.last_name}`}
            memberPhone={selectedMember.profiles.phone}
          />
          <MessageMemberDialog 
            open={messageDialogOpen}
            onOpenChange={setMessageDialogOpen}
            memberName={`${selectedMember.profiles.first_name} ${selectedMember.profiles.last_name}`}
            memberId={selectedMember.id}
            recipientUserId={selectedMember.user_id}
          />
        </>
      )}
    </NurseDashboardLayout>
  );
}
