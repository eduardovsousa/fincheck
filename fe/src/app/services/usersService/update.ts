import { httpClient } from "../httpClient";

export interface UpdateUserProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Date;
  phone: string;
}

export async function update({ id, ...params }: UpdateUserProps) {
  const { data } = await httpClient.put(`/users/${id}`, params);

  return data;
}
