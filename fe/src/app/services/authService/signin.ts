import { httpClient } from "../httpClient";

export interface SigninProps {
  email: string;
  password: string;
}

interface SigninResponse {
  accessToken: string;
}

export async function signin(params: SigninProps) {
  const { data } = await httpClient.post<SigninResponse>(
    "/auth/signin",
    params
  );

  return data;
}
