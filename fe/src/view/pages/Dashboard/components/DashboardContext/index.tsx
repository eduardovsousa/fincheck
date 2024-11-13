import { createContext, useCallback, useState } from "react";

interface DashboardContextProps {
  areValuesVisible: boolean;
  toggleValueVisibily(): void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DashboardContext = createContext({} as DashboardContextProps);

export function DashboardProvicer({ children }: { children: React.ReactNode }) {
  const [areValuesVisible, setAreValuesVisible] = useState(true);

  const toggleValueVisibily = useCallback(() => {
    setAreValuesVisible((prevState) => !prevState);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ areValuesVisible, toggleValueVisibily }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
