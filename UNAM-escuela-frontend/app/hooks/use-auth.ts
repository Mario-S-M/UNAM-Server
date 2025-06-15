import { useMutation } from "@tanstack/react-query";
import { loginAction } from "../actions/auth-actions";
import { Login } from "../interfaces/auth-interfaces";

export function useLogin() {
  return useMutation({
    mutationFn: loginAction,
  });
}
