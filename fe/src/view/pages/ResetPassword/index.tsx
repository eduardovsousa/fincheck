import { useState } from "react";
import { RecoveryContext } from "../../../app/contexts/RecoveryContext";
import { OTPInput } from "./components/OTPInput";
import { Recovered } from "./components/Recovered";
import { Reset } from "./components/Reset";
import { SendReset } from "./components/SendReset";

export function ResetPassword() {
  const [page, setPage] = useState("SendReset");
  const [email, setEmail] = useState<string | undefined>();
  const [otp, setOTP] = useState<number | undefined>();

  function NavigateComponents() {
    if (page === "SendReset") return <SendReset />;
    if (page === "otp") return <OTPInput />;
    if (page === "reset") return <Reset />;
    if (page === "recovered") return <Recovered />;
  }

  return (
    <RecoveryContext.Provider
      value={{ page, setPage, otp, setOTP, setEmail, email }}
    >
      <div className="flex justify-center items-center">
        <NavigateComponents />
      </div>
    </RecoveryContext.Provider>
  );
}
