import { Badge } from '@/components/ui/badge';
import { VALIDATION_STATUS_OPTIONS } from '../constants';

interface ValidationStatusBadgeProps {
  status: string;
}

export function ValidationStatusBadge({ status }: ValidationStatusBadgeProps) {
  const statusConfig = VALIDATION_STATUS_OPTIONS.find(opt => opt.value === status);
  
  if (!statusConfig) return null;
  
  const Icon = statusConfig.icon;
  
  return (
    <Badge className={statusConfig.color}>
      <Icon className="h-3 w-3 mr-1" />
      {statusConfig.label}
    </Badge>
  );
}