import { cn } from '@/lib/utils';

interface AgentBadgeProps {
  agent: 'clara' | 'ineke' | 'isabella' | 'lee';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const agentColors = {
  clara: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  ineke: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  isabella: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  lee: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
};

const agentNames = {
  clara: 'Clara',
  ineke: 'Ineke',
  isabella: 'Isabella',
  lee: 'LEE',
};

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function AgentBadge({ agent, size = 'sm', className }: AgentBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        agentColors[agent],
        sizeClasses[size],
        className
      )}
    >
      {agentNames[agent]}
    </span>
  );
}
