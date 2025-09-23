'use client';

import React from 'react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { getRoleBadgeProps, getRoleLabel, RoleType } from '@/lib/role-utils';

interface RoleBadgeProps {
  role: string;
  className?: string;
  showLabel?: boolean;
}

export function RoleBadge({ role, className, showLabel = true }: RoleBadgeProps) {
  const { variant, className: roleClassName } = getRoleBadgeProps(role as RoleType);
  const label = showLabel ? getRoleLabel(role as RoleType) : role;
  
  return (
    <Badge 
      variant={variant} 
      className={cn(roleClassName, className)}
    >
      {label}
    </Badge>
  );
}