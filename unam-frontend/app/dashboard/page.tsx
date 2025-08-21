'use client';

import React from 'react';
import SkillDetailPanel from '@/components/dashboard/SkillDetailPanel';

export default function DashboardPage() {
  return (
    <div className="h-[calc(100vh-120px)]">
      <SkillDetailPanel />
    </div>
  );
}