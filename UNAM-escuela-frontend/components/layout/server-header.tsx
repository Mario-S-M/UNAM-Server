import { getCurrentUser } from "@/app/actions/auth";
import { ClientHeader } from "./header";

export async function ServerHeader() {
  const user = await getCurrentUser();

  return <ClientHeader initialUser={user} />;
}
