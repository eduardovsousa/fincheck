import { sendOTP } from "./sendOTP";
import { sendResetEmail } from "./sendResetEmail";
import { signin } from "./signin";
import { signup } from "./signup";

export const authService = {
  signin,
  signup,
  sendOTP,
  sendResetEmail,
};
