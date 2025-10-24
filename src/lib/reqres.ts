export type ReqresUser = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  name?: string;
  favorite?: boolean;
};

export async function fetchAllReqresUsers(): Promise<ReqresUser[]> {
  const res = await fetch("/api/reqres");
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    // incluir status y cuerpo en el error para depurar desde cliente
    throw new Error(`reqres proxy failed: ${res.status} - ${txt}`);
  }
  const json = await res.json();
  return (json?.data ?? []) as ReqresUser[];
}