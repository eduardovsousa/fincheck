import { sleep } from "../../utils/sleep";
import { httpClient } from "../httpClient";

export interface SingupParams {
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupResponse {
  accessToken: string;
}

export async function signup(params: SingupParams) {
  await sleep();

  const { data } = await httpClient.post<SignupResponse>(
    "/auth/signup",
    params
  );

  return data;
}
