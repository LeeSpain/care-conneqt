import { useState, useEffect, useRef } from 'react';
import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Upload, Trash2, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { KnowledgeBaseManager } from '@/components/ai-agents/KnowledgeBaseManager';
import { FunctionManager } from '@/components/ai-agents/FunctionManager';
import { AgentAnalytics } from '@/components/ai-agents/AgentAnalytics';
import { useTranslation } from 'react-i18next';

interface AgentData {
  id: string;
  name: string;
  display_name: string;
  description: string;
  status: string;
  avatar_url: string | null;
  config: {
    system_prompt: string;
    model: string;
    temperature: number;
    max_tokens: number;
    response_style: string;
  };
}

interface AgentSettingsPageProps {
  agentName: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconColorClass: string;
  gradientClass: string;
  specificSettings?: React.ReactNode;
}

export function AgentSettingsPage({
  agentName,
  title,
  subtitle,
  icon: Icon,
  iconColorClass,
  gradientClass,
  specificSettings
}: AgentSettingsPageProps) {
  const { t } = useTranslation('dashboard-admin');
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fetchInProgress = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAgent();
    return () => {
      fetchInProgress.current = false;
    };
  }, [agentName]);

  const fetchAgent = async () => {
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;

    try {
      const { data: agentData, error: agentError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('name', agentName)
        .single();

      if (agentError) throw agentError;

      const { data: configData, error: configError } = await supabase
        .from('ai_agent_configurations')
        .select('*')
        .eq('agent_id', agentData.id)
        .single();

      if (configError) throw configError;

      setAgent({
        ...agentData,
        config: configData
      });
    } catch (error) {
      console.error('Error fetching agent:', error);
      toast.error(t('aiAgents.settings.loadError'));
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  };

  const saveGeneralSettings = async () => {
    if (!agent) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({
          display_name: agent.display_name,
          description: agent.description,
          status: agent.status
        })
        .eq('id', agent.id);

      if (error) throw error;
      toast.success(t('aiAgents.settings.generalSaved'));
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(t('aiAgents.settings.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const saveConfiguration = async () => {
    if (!agent) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('ai_agent_configurations')
        .update({
          system_prompt: agent.config.system_prompt,
          model: agent.config.model,
          temperature: agent.config.temperature,
          max_tokens: agent.config.max_tokens,
          response_style: agent.config.response_style
        })
        .eq('agent_id', agent.id);

      if (error) throw error;
      toast.success(t('aiAgents.settings.configSaved'));
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error(t('aiAgents.settings.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!agent || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('aiAgents.settings.fileSizeError'));
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error(t('aiAgents.settings.fileFormatError'));
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${agent.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('ai-agent-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ai-agent-avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('ai_agents')
        .update({ avatar_url: publicUrl })
        .eq('id', agent.id);

      if (updateError) throw updateError;

      setAgent({ ...agent, avatar_url: publicUrl });
      toast.success(t('aiAgents.settings.avatarUploaded'));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error(t('aiAgents.settings.avatarUploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!agent || !agent.avatar_url) return;
    setUploading(true);

    try {
      const urlParts = agent.avatar_url.split('/');
      const filePath = urlParts.slice(-2).join('/');

      const { error: deleteError } = await supabase.storage
        .from('ai-agent-avatars')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('ai_agents')
        .update({ avatar_url: null })
        .eq('id', agent.id);

      if (updateError) throw updateError;

      setAgent({ ...agent, avatar_url: null });
      toast.success(t('aiAgents.settings.avatarRemoved'));
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error(t('aiAgents.settings.avatarRemoveFailed'));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout title={title}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!agent) {
    return (
      <AdminDashboardLayout title={title}>
        <div className="text-center py-8">{t('aiAgents.agentNotFound')}</div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout title={title}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard/admin/ai-agents">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${gradientClass}`}>
                <Icon className={`h-8 w-8 ${iconColorClass}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>
          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
            {agent.status}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">{t('aiAgents.settings.general')}</TabsTrigger>
            <TabsTrigger value="prompt">{t('aiAgents.settings.systemPrompt')}</TabsTrigger>
            <TabsTrigger value="personality">{t('aiAgents.settings.personality')}</TabsTrigger>
            <TabsTrigger value="knowledge">{t('aiAgents.settings.knowledgeBase')}</TabsTrigger>
            <TabsTrigger value="functions">{t('aiAgents.settings.functions')}</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiAgents.settings.generalSettings')}</CardTitle>
                <CardDescription>{t('aiAgents.settings.generalDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    {agent.avatar_url ? (
                      <AvatarImage src={agent.avatar_url} alt={agent.display_name} />
                    ) : (
                      <AvatarFallback className={gradientClass}>
                        <Icon className={`h-10 w-10 ${iconColorClass}`} />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <Label className="text-base font-semibold">{t('aiAgents.settings.agentAvatar')}</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('aiAgents.settings.avatarDescription')}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? t('aiAgents.settings.uploading') : t('aiAgents.settings.uploadAvatar')}
                      </Button>

                      {agent.avatar_url && (
                        <Button
                          variant="outline"
                          onClick={handleRemoveAvatar}
                          disabled={uploading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('aiAgents.settings.remove')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="display_name">{t('aiAgents.settings.displayName')}</Label>
                  <Input
                    id="display_name"
                    value={agent.display_name}
                    onChange={(e) => setAgent({ ...agent, display_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('aiAgents.settings.description')}</Label>
                  <Textarea
                    id="description"
                    value={agent.description || ''}
                    onChange={(e) => setAgent({ ...agent, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="status">{t('aiAgents.settings.status')}</Label>
                  <Select
                    value={agent.status}
                    onValueChange={(value) => setAgent({ ...agent, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('aiAgents.settings.statusActive')}</SelectItem>
                      <SelectItem value="inactive">{t('aiAgents.settings.statusInactive')}</SelectItem>
                      <SelectItem value="training">{t('aiAgents.settings.statusTraining')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {specificSettings}

                <Button onClick={saveGeneralSettings} disabled={saving}>
                  {saving ? t('aiAgents.settings.saving') : t('aiAgents.settings.saveChanges')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Prompt */}
          <TabsContent value="prompt">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiAgents.settings.systemPromptTitle')}</CardTitle>
                <CardDescription>{t('aiAgents.settings.systemPromptDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="system_prompt">{t('aiAgents.settings.systemPrompt')}</Label>
                  <Textarea
                    id="system_prompt"
                    value={agent.config.system_prompt}
                    onChange={(e) => setAgent({
                      ...agent,
                      config: { ...agent.config, system_prompt: e.target.value }
                    })}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t('aiAgents.settings.systemPromptHelp')}
                  </p>
                </div>

                <Button onClick={saveConfiguration} disabled={saving}>
                  {saving ? t('aiAgents.settings.saving') : t('aiAgents.settings.saveSystemPrompt')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality & AI Settings */}
          <TabsContent value="personality">
            <Card>
              <CardHeader>
                <CardTitle>{t('aiAgents.settings.personalityTitle')}</CardTitle>
                <CardDescription>{t('aiAgents.settings.personalityDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="model">{t('aiAgents.settings.aiModel')}</Label>
                  <Select
                    value={agent.config.model}
                    onValueChange={(value) => setAgent({
                      ...agent,
                      config: { ...agent.config, model: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google/gemini-2.5-flash">{t('aiAgents.settings.modelFlash')}</SelectItem>
                      <SelectItem value="google/gemini-2.5-pro">{t('aiAgents.settings.modelPro')}</SelectItem>
                      <SelectItem value="google/gemini-2.5-flash-lite">{t('aiAgents.settings.modelLite')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="response_style">{t('aiAgents.settings.responseStyle')}</Label>
                  <Select
                    value={agent.config.response_style}
                    onValueChange={(value) => setAgent({
                      ...agent,
                      config: { ...agent.config, response_style: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">{t('aiAgents.settings.styleFriendly')}</SelectItem>
                      <SelectItem value="supportive">{t('aiAgents.settings.styleSupportive')}</SelectItem>
                      <SelectItem value="professional">{t('aiAgents.settings.styleProfessional')}</SelectItem>
                      <SelectItem value="executive">{t('aiAgents.settings.styleExecutive')}</SelectItem>
                      <SelectItem value="concise">{t('aiAgents.settings.styleConcise')}</SelectItem>
                      <SelectItem value="detailed">{t('aiAgents.settings.styleDetailed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="temperature">
                    {t('aiAgents.settings.temperature')}: {agent.config.temperature}
                    <span className="text-xs text-muted-foreground ml-2">{t('aiAgents.settings.temperatureHelp')}</span>
                  </Label>
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={agent.config.temperature}
                    onChange={(e) => setAgent({
                      ...agent,
                      config: { ...agent.config, temperature: parseFloat(e.target.value) }
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="max_tokens">{t('aiAgents.settings.maxTokens')}</Label>
                  <Input
                    id="max_tokens"
                    type="number"
                    value={agent.config.max_tokens}
                    onChange={(e) => setAgent({
                      ...agent,
                      config: { ...agent.config, max_tokens: parseInt(e.target.value) || 1024 }
                    })}
                  />
                </div>

                <Button onClick={saveConfiguration} disabled={saving}>
                  {saving ? t('aiAgents.settings.saving') : t('aiAgents.settings.saveConfig')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base */}
          <TabsContent value="knowledge">
            <KnowledgeBaseManager agentId={agent.id} agentType={agent.config?.response_style === 'professional' ? 'nurse_support' : 'customer_service'} />
          </TabsContent>

          {/* Functions */}
          <TabsContent value="functions">
            <FunctionManager agentId={agent.id} />
          </TabsContent>
        </Tabs>

        {/* Analytics Section */}
        <AgentAnalytics agentId={agent.id} />
      </div>
    </AdminDashboardLayout>
  );
}
