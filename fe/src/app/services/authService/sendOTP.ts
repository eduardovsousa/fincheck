import { httpClient } from "../httpClient";

export interface SendOTPParams {
  recipient_email: string | "";
  otpCode: number;
}

export async function sendOTP(params: SendOTPParams) {
  const { data } = await httpClient.post('/auth/send_recovery_email', params);

  return data;
}