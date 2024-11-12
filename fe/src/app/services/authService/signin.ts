import { httpClient } from "../HttpClient";

interface SingupProps {
  email: string;
  password: string;
}

export async function signin(params: SingupProps) {
  const { data } = await httpClient.post<{ accessToken: string }>(
    "/auth/signin",
    params
  );

  return data;
}
