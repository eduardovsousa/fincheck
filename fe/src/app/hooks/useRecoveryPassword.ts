import { useContext } from "react";
import { RecoveryContext } from "../contexts/RecoveryContext";

export function useRecoveryPassword() {
  return useContext(RecoveryContext);
}
