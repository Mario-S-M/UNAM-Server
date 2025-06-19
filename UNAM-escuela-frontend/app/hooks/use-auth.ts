import { useMutation } from "@tanstack/react-query";
import { loginAction } from "../actions/auth-actions";

export function useLogin() {
  return useMutation({
    mutationFn: loginAction,
  });
}
