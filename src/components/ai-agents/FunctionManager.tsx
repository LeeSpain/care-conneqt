import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface AgentFunction {
  id: string;
  function_name: string;
  function_description: string;
  parameters: any;
  is_enabled: boolean;
  requires_permission: boolean;
}

interface FunctionManagerProps {
  agentId: string;
}

export const FunctionManager = ({ agentId }: FunctionManagerProps) => {
  const [functions, setFunctions] = useState<AgentFunction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFunction, setEditingFunction] = useState<AgentFunction | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    function_name: '',
    function_description: '',
    parameters: '{}',
    is_enabled: true,
    requires_permission: false
  });

  useEffect(() => {
    fetchFunctions();
  }, [agentId]);

  const fetchFunctions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_functions')
        .select('*')
        .eq('agent_id', agentId)
        .order('function_name');

      if (error) throw error;
      setFunctions(data || []);
    } catch (error) {
      console.error('Error fetching functions:', error);
      toast.error('Failed to load functions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let parsedParameters;
    try {
      parsedParameters = JSON.parse(formData.parameters);
    } catch {
      toast.error('Invalid JSON in parameters');
      return;
    }

    const functionData = {
      agent_id: agentId,
      function_name: formData.function_name,
      function_description: formData.function_description,
      parameters: parsedParameters,
      is_enabled: formData.is_enabled,
      requires_permission: formData.requires_permission
    };

    try {
      if (editingFunction) {
        const { error } = await supabase
          .from('ai_agent_functions')
          .update(functionData)
          .eq('id', editingFunction.id);

        if (error) throw error;
        toast.success('Function updated');
      } else {
        const { error } = await supabase
          .from('ai_agent_functions')
          .insert(functionData);

        if (error) throw error;
        toast.success('Function added');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFunctions();
    } catch (error) {
      console.error('Error saving function:', error);
      toast.error('Failed to save function');
    }
  };

  const handleEdit = (func: AgentFunction) => {
    setEditingFunction(func);
    setFormData({
      function_name: func.function_name,
      function_description: func.function_description,
      parameters: JSON.stringify(func.parameters, null, 2),
      is_enabled: func.is_enabled,
      requires_permission: func.requires_permission
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this function?')) return;

    try {
      const { error } = await supabase
        .from('ai_agent_functions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Function deleted');
      fetchFunctions();
    } catch (error) {
      console.error('Error deleting function:', error);
      toast.error('Failed to delete function');
    }
  };

  const toggleEnabled = async (func: AgentFunction) => {
    try {
      const { error } = await supabase
        .from('ai_agent_functions')
        .update({ is_enabled: !func.is_enabled })
        .eq('id', func.id);

      if (error) throw error;
      toast.success(`Function ${!func.is_enabled ? 'enabled' : 'disabled'}`);
      fetchFunctions();
    } catch (error) {
      console.error('Error toggling function:', error);
      toast.error('Failed to update function');
    }
  };

  const resetForm = () => {
    setFormData({
      function_name: '',
      function_description: '',
      parameters: '{}',
      is_enabled: true,
      requires_permission: false
    });
    setEditingFunction(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading functions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Functions & Tools</h3>
          <p className="text-muted-foreground">Configure callable functions for the AI agent</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Function
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingFunction ? 'Edit' : 'Add'} Function</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="function_name">Function Name *</Label>
                <Input
                  id="function_name"
                  value={formData.function_name}
                  onChange={(e) => setFormData({ ...formData, function_name: e.target.value })}
                  placeholder="get_pricing_info"
                  required
                />
              </div>

              <div>
                <Label htmlFor="function_description">Description *</Label>
                <Textarea
                  id="function_description"
                  value={formData.function_description}
                  onChange={(e) => setFormData({ ...formData, function_description: e.target.value })}
                  placeholder="Fetches pricing information for services"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="parameters">Parameters (JSON Schema) *</Label>
                <Textarea
                  id="parameters"
                  value={formData.parameters}
                  onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                  placeholder='{"type": "object", "properties": {"service": {"type": "string"}}}'
                  rows={6}
                  className="font-mono text-sm"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_enabled"
                  checked={formData.is_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_enabled: checked })}
                />
                <Label htmlFor="is_enabled">Enabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="requires_permission"
                  checked={formData.requires_permission}
                  onCheckedChange={(checked) => setFormData({ ...formData, requires_permission: checked })}
                />
                <Label htmlFor="requires_permission">Requires Permission</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFunction ? 'Update' : 'Add'} Function
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {functions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No functions configured. Add functions to extend AI capabilities.
            </CardContent>
          </Card>
        ) : (
          functions.map(func => (
            <Card key={func.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <code className="text-sm font-mono">{func.function_name}</code>
                      {!func.is_enabled && (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                      {func.requires_permission && (
                        <Badge variant="outline">Auth Required</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {func.function_description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Switch
                      checked={func.is_enabled}
                      onCheckedChange={() => toggleEnabled(func)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(func)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(func.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View Parameters
                  </summary>
                  <pre className="mt-2 p-4 bg-secondary rounded-lg overflow-x-auto">
                    {JSON.stringify(func.parameters, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
