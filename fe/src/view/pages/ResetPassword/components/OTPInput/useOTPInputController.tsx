import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useRecoveryPassword } from "../../../../../app/hooks/useRecoveryPassword";
import { httpClient } from "../../../../../app/services/httpClient";

export function useOTPInputController() {
  const { email, setPage } = useRecoveryPassword();
  const [timerCount, setTimer] = useState(60);
  const [OTPinput, setOTPinput] = useState(["", "", "", "", "", ""]);
  const [disable, setDisable] = useState(true);

  const resendOTP = () => {
    if (disable) return;
    httpClient
      .post("/auth/send_recovery_email", { recipient_email: email })
      .then(() => setDisable(true))
      .then(() => toast.success("Um novo código foi enviado para o seu e-mail"))
      .then(() => setTimer(60));
  };

  const verifyOTP = () => {
    const enteredOTP = OTPinput.map((digit) => Number(digit)).join("");
    const OTPCode = parseInt(enteredOTP);
    if (!enteredOTP) {
      toast.success("Por favor, insira o código");
      return;
    }

    httpClient
      .post("/auth/verify_otp", { recipient_email: email, otpCode: OTPCode })
      .then(() => setPage("reset"))
      .catch(() =>
        toast.error("Código incorreto. Verifique o código em seu e-mail")
      );
  };

  useEffect(() => {
    if (email) {
      localStorage.setItem("recipient_email", email);
    }

    const interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable, email]);

  return {
    timerCount,
    email,
    OTPinput,
    disable,
    resendOTP,
    verifyOTP,
    setOTPinput,
  };
}
