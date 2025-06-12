import { useQuery } from "@tanstack/react-query";
import { getActiveLenguages } from "../actions/lenguage-actions";

// Query hooks
export function useActiveLenguages() {
  return useQuery({
    queryKey: ["lenguages", "active"],
    queryFn: getActiveLenguages,
  });
}
