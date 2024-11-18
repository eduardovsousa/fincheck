import { RefObject, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { useRecoveryPassword } from "../../../../../app/hooks/useRecoveryPassword";
import { httpClient } from "../../../../../app/services/httpClient";
import { Spinner } from "../../../../components/Spinner";

type InputRef = RefObject<HTMLInputElement>;

interface ResetPasswordError {
  response: { data: { message: string } };
}

export function OTPInput() {
  const { email, setPage } = useRecoveryPassword();
  const [timerCount, setTimer] = useState(60);
  const [isPending, setIsPending] = useState(false);
  const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
  const [disable, setDisable] = useState(true);
  const inputRefs: InputRef[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleInput = (index: number, value: string) => {
    setOTPinput((prevInput) => {
      const newInput = [...prevInput];
      newInput[index] = value;

      if (index < inputRefs.length - 1 && value !== "") {
        inputRefs[index + 1]?.current?.focus();
      }

      return newInput;
    });
  };

  function resendOTP() {
    if (disable) return;
    setIsPending(true);
    httpClient
      .post("/auth/send_recovery_email", { recipient_email: email })
      .then(() => setDisable(true))
      .then(() => toast.success("Um novo código foi enviado para o seu e-mail"))
      .then(() => setTimer(60))
      .finally(() => setIsPending(false));
  }

  function verifyOTP() {
    const enteredOTP = OTPinput.map((digit) => Number(digit)).join("");

    const OTPCode = parseInt(enteredOTP);
    if (!enteredOTP) {
      toast.error("Por favor, insira o código");
      return;
    }

    setIsPending(true);
    httpClient
      .post("/auth/verify_otp", { recipient_email: email, otpCode: OTPCode })
      .then(() => setPage("reset"))
      .catch((error) => {
        const { message } = (error as ResetPasswordError).response.data;
        toast.error(message);
      })
      .finally(() => setIsPending(false));
  }

  useEffect(() => {
    if (email) {
      localStorage.getItem("recipient_email");
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
  }, [email, disable]);

  return (
    <div className="flex justify-center items-center w-screen bg-gray-50">
      <div className="px-6 pt-10 pb-9 mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl text-gray-900">
              <p>Verificação de e-mail</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-700">
              <p>
                Enviamos o código para o email:{" "}
                <strong className="text-gray-900">{email}</strong>
                <span className="italic">
                  <br />O código irá expirar em 10 minutos
                </span>
              </p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs space-x-2">
                  {inputRefs.map((ref, index) => (
                    <div className="w-16 h-16" key={index}>
                      <input
                        maxLength={1}
                        ref={ref}
                        className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:ring-1 ring-gray-700 transition-colors"
                        type="text"
                        onChange={(e) => handleInput(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <a
                      onClick={() => verifyOTP()}
                      className={`flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-teal-900 hover:bg-teal-800 transition-colors border-none text-white shadow-sm ${
                        isPending
                          ? "cursor-not-allowed bg-gray-100 opacity-70"
                          : ""
                      }`}
                    >
                      {isPending ? <Spinner /> : "Verificar conta"}
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-600">
                    <p>Não recebeu o código?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "gray",
                        cursor: disable ? "default" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable
                        ? `Solicite novamente em ${timerCount}s`
                        : "Novo código"}
                    </a>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 font-bold italic">
                    <p>Verifique a caixa de spam</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
