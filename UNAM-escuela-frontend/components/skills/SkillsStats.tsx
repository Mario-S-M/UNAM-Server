import React from "react";
import { Card, CardBody } from "@heroui/react";
import { BookOpen, CheckCircle, XCircle, BarChart3 } from "lucide-react";

interface SkillsStatsProps {
  total: number;
  active: number;
  inactive: number;
}

export const SkillsStats: React.FC<SkillsStatsProps> = ({
  total,
  active,
  inactive,
}) => {
  const stats = [
    {
      title: "Total de Skills",
      value: total,
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Skills Activas",
      value: active,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Skills Inactivas",
      value: inactive,
      icon: XCircle,
      color: "text-danger",
      bgColor: "bg-danger/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground/60">{stat.title}</p>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
