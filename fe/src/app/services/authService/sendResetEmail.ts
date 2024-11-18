import { httpClient } from "../httpClient";

export interface SendResetEmailParams {
  recipient_email: string | undefined;
}

export async function sendResetEmail(params: SendResetEmailParams) {
  const { data } = await httpClient.post('/auth/send_recovery_email', params);

  return data;
}