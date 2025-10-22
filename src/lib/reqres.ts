export type ReqresUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

/**
 * Obtiene los usuarios desde la API local.
 */
export async function fetchAllReqresUsers(page = 1): Promise<ReqresUser[]> {
  try {
    const res = await fetch(`http://localhost:4000/api/users?page=${page}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Local API request failed: ${res.status} - ${txt}`);
    }

    const json = await res.json();
    return (json?.data ?? []) as ReqresUser[];
  } catch (err) {
    console.error("Error fetching local users:", err);
    throw err;
  }
}


// export type ReqresUser = {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   avatar: string;
// };

// export async function fetchAllReqresUsers(): Promise<ReqresUser[]> {
//   const res = await fetch("/api/reqres");
//   if (!res.ok) {
//     const txt = await res.text().catch(() => "");
//     throw new Error(`reqres proxy failed: ${res.status} - ${txt}`);
//   }
//   const json = await res.json();
//   return (json?.data ?? []) as ReqresUser[];
// }