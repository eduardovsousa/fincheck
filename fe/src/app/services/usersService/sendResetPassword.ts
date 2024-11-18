import { httpClient } from "../httpClient";

export interface SendResetPassword {
  recipient_email: string | undefined;
  password: string;
  confirmPassword: string;
}

export async function sendResetPassword(params: SendResetPassword) {
  const { data } = await httpClient.post('/auth/change_pass', params);

  return data;
}