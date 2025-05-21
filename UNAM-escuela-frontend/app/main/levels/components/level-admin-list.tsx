"use client";
import { getAllLevels } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import { Card, CardBody, Skeleton } from "@heroui/react";
import GlobalButton from "@/components/global/globalButton";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";

export default function AdminLevelList() {
  // const router = useRouter();
  const {
    data: levels,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["levels"],
    queryFn: getAllLevels,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (isLoading)
    return (
      <>
        <Card className="w-[400px] space-y-5 p-4" radius="lg">
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-6 w-4/5 rounded-lg bg-default-200" />
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </div>
        </Card>
      </>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {levels?.data.map((level) => (
        <Card
          key={level.id}
          className="w-full max-w-sm border-gray-400 border-3 rounded-lg p-4 bg-transparent"
        >
          <CardBody className="gap-4 relative">
            <div className="space-y-2">
              <h2 className="text-3xl text-black dark:text-white font-bold">
                {level.name}
              </h2>
              <p className="text-sm text-default-500">{level.description}</p>
            </div>

            <div className="absolute top-0 right-0 flex gap-2">
              <Link href={`/main/levels/${level.id}/edit`}>
                <GlobalButton color="default" isIconOnly={true} size="md">
                  <Pencil size={18} />
                </GlobalButton>
              </Link>
              <Link href={`/main/levels/${level.id}/delete`}>
                <GlobalButton color="danger" size="md" isIconOnly={true}>
                  <Trash2 size={16} />
                </GlobalButton>
              </Link>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
