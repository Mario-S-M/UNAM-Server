import { Badge } from "@/components/ui/badge";
import { GraduationCap } from "lucide-react";
import { SkillDetails } from "@/components/skills/SkillDetails";
import { WelcomeDashboard } from "@/components/dashboard/WelcomeDashboard";

export default function DashboardPage() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-3xl w-full space-y-8 p-4">
        <SkillDetails />
        <WelcomeDashboard />
      </div>
    </div>
  );
}