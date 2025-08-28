import { WelcomeDashboard } from "@/components/dashboard/WelcomeDashboard";

export default function DashboardPage() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="max-w-3xl w-full space-y-8 p-4">
        <WelcomeDashboard />
      </div>
    </div>
  );
}