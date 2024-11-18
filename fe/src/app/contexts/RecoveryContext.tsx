import { createContext } from "react";

type RecoveryContextType = {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
  otp: number | undefined;
  setOTP: React.Dispatch<React.SetStateAction<number | undefined>>;
  email: string | undefined;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const RecoveryContext = createContext({} as RecoveryContextType);
