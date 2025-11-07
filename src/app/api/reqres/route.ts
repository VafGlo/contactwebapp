import fs from "fs/promises";
import path from "path";

type ReqresUser = {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  avatar?: string;
  favorite?: boolean;
};

const STORE_PATH = path.join(process.cwd(), "data", "contacts_store.json");

async function fetchAllReqresUsersDirect(): Promise<ReqresUser[]> {
  const url = `https://reqres.in/api/users?page=1`;
  // obtener las páginas
  const first = await fetch(`https://reqres.in/api/users?page=1`).then((r) => r.json());
  const totalPages = first.total_pages ?? 1;
  const users: ReqresUser[] = [...(first.data ?? [])];
  for (let p = 2; p <= totalPages; p++) {
    const page = await fetch(`https://reqres.in/api/users?page=${p}`).then((r) => r.json());
    users.push(...(page.data ?? []));
  }
  // map a forma simple
  return users.map((u: any) => {
    const first = (u.first_name ?? "").toString().trim();
    const last = (u.last_name ?? "").toString().trim();
    const nameFromParts = [first, last].filter(Boolean).join(" ");
    const name = (u.name && u.name.toString().trim()) || nameFromParts || u.email || "";
    return {
      id: u.id,
      email: u.email,
      first_name: first || undefined,
      last_name: last || undefined,
      name,
      avatar: u.avatar,
      favorite: false,
    };
  });
}

async function readStore(): Promise<ReqresUser[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as ReqresUser[];
  } catch (e) {
    return [];
  }
}

async function writeStore(data: ReqresUser[]) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function ensureStoreInitialized() {
  const current = await readStore();
  if (current.length === 0) {
    const users = await fetchAllReqresUsersDirect();
    await writeStore(users);
    return users;
  }
  return current;
}

//CRUD

//Estamos trayendo la info
export async function GET() {
  try {
    const data = await ensureStoreInitialized();
    return new Response(JSON.stringify({ data }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function POST(request: Request) {
  // crear nuevo contacto: body { name, email, favorite? }
  try {
    const body = (await request.json()) as Partial<ReqresUser>;
    if (!body?.name || !body?.email) {
      return new Response(JSON.stringify({ error: "name and email required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const store = await ensureStoreInitialized();
    const newId = store.length > 0 ? Math.max(...store.map((s) => s.id)) + 1 : 1;
    const created: ReqresUser = { id: newId, name: body.name, email: body.email, favorite: !!body.favorite, avatar: body.avatar ?? "" };
    store.push(created);
    await writeStore(store);
    return new Response(JSON.stringify({ data: created }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function PUT(request: Request) {
  // actualizar contacto: body { id, name?, email?, favorite? }
  try {
    const body = (await request.json()) as Partial<ReqresUser> & { id?: number };
    if (!body?.id) {
      return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const store = await ensureStoreInitialized();
    const idx = store.findIndex((s) => s.id === body.id);
    if (idx === -1) {
      return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const updated = { ...store[idx], ...body };
    store[idx] = updated;
    await writeStore(store);
    return new Response(JSON.stringify({ data: updated }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(request: Request) {
  // borrar por query ?id=123 o body { id }
  try {
    const url = new URL(request.url);
    const qid = url.searchParams.get("id");
    let id: number | null = qid ? Number(qid) : null;
    if (!id) {
      try {
        const body = (await request.json()) as { id?: number };
        id = body?.id ?? null;
      } catch {
        id = null;
      }
    }
    if (!id) {
      return new Response(JSON.stringify({ error: "id required" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const store = await ensureStoreInitialized();
    const idx = store.findIndex((s) => s.id === id);
    if (idx === -1) {
      return new Response(JSON.stringify({ error: "not_found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    const removed = store.splice(idx, 1)[0];
    await writeStore(store);
    return new Response(JSON.stringify({ data: removed }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}