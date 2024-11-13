import { useContext } from "react";
import { DashboardContext } from ".";

export function useDashboardContext() {
  return useContext(DashboardContext);
}
