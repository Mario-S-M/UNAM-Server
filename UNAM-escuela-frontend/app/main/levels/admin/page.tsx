import AdminLevelList from "../../levels/components/level-admin-list";
import { verifySession } from "./auth/dal";

export default async function LevelsAdminPage() {
    await verifySession();
  return (
    <>
      <AdminLevelList />
    </>
  );
}
