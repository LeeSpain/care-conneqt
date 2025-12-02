import { Loader2, ArrowRight } from 'lucide-react';
import { AgentBadge } from './AgentBadge';

interface HandoffIndicatorProps {
  sourceAgent: 'clara' | 'ineke' | 'isabella' | 'lee';
  targetAgent: 'clara' | 'ineke' | 'isabella' | 'lee';
  isLoading?: boolean;
}

export function HandoffIndicator({ sourceAgent, targetAgent, isLoading = true }: HandoffIndicatorProps) {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50 animate-pulse">
      <AgentBadge agent={sourceAgent} size="sm" />
      <span className="text-muted-foreground text-sm">is consulting</span>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
      <AgentBadge agent={targetAgent} size="sm" />
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />}
    </div>
  );
}
