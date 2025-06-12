import { useQuery } from "@tanstack/react-query";
import {
  getActiveLenguages,
  getLanguageById,
} from "../actions/lenguage-actions";

// Query hooks
export function useActiveLenguages() {
  return useQuery({
    queryKey: ["lenguages", "active"],
    queryFn: getActiveLenguages,
  });
}

export function useLanguageById(id: string) {
  return useQuery({
    queryKey: ["lenguage", id],
    queryFn: () => getLanguageById(id),
    enabled: !!id,
  });
}
