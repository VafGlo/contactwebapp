export type Contact = {
  id: number;
  name: string;
  email: string;
  favorite: boolean;
  avatar?: string;
};

export interface IContactRepository {
  getAll(): Promise<Contact[]>;
  create(data: Omit<Contact, "id">): Promise<Contact>;
  update(id: number, changes: Partial<Omit<Contact, "id">>): Promise<Contact>;
  delete(id: number): Promise<void>;
}

function normalizeRaw(u: any): Contact {
  const first = (u.first_name ?? "").toString().trim();
  const last = (u.last_name ?? "").toString().trim();
  const nameFromParts = [first, last].filter(Boolean).join(" ");
  const name = (u.name && u.name.toString().trim()) || nameFromParts || u.email || "";
  return {
    id: Number(u.id),
    name,
    email: u.email,
    favorite: !!u.favorite,
    avatar: u.avatar,
  };
}

export class ApiContactRepository implements IContactRepository {
  private base = "/api/reqres";

  async getAll(): Promise<Contact[]> {
    const res = await fetch(this.base);
    if (!res.ok) throw new Error(`GET contacts failed: ${res.status}`);
    const json = await res.json();
    return (json?.data ?? []).map(normalizeRaw);
  }

  async create(data: Omit<Contact, "id">): Promise<Contact> {
    const res = await fetch(this.base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Create contact failed: ${res.status}`);
    const json = await res.json();
    return normalizeRaw(json.data);
  }

  async update(id: number, changes: Partial<Omit<Contact, "id">>): Promise<Contact> {
    const payload = { id, ...changes };
    const res = await fetch(this.base, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Update contact failed: ${res.status}`);
    const json = await res.json();
    return normalizeRaw(json.data);
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.base}?id=${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete contact failed: ${res.status}`);
  }
}

/**
 * LocalContactRepository
 * - Persiste por usuario en localStorage bajo la key contacts:{userId}
 * - Usa fallbackRepo para inicializar la lista (trae datos públicos desde API la primera vez)
 * - Las operaciones create/update/delete sólo actúan sobre localStorage (no alteran el servidor)
 */
export class LocalContactRepository implements IContactRepository {
  private userId: string;
  private fallback: IContactRepository;

  constructor(userId: string, fallbackRepo?: IContactRepository) {
    this.userId = userId;
    this.fallback = fallbackRepo ?? new ApiContactRepository();
  }

  private key() {
    return `contacts:${this.userId}`;
  }

  private readStore(): Contact[] {
    try {
      const raw = localStorage.getItem(this.key());
      if (!raw) return [];
      return JSON.parse(raw) as Contact[];
    } catch {
      return [];
    }
  }

  private writeStore(items: Contact[]) {
    try {
      localStorage.setItem(this.key(), JSON.stringify(items));
    } catch {
      // ignore
    }
  }

  async getAll(): Promise<Contact[]> {
    // si hay datos locales, devolverlos
    const local = this.readStore();
    if (local && local.length > 0) return local;
    // sino inicializar desde fallback y guardar localmente
    const remote = await this.fallback.getAll();
    this.writeStore(remote);
    return remote;
  }

  async create(data: Omit<Contact, "id">): Promise<Contact> {
    const items = this.readStore();
    const maxId = items.length > 0 ? Math.max(...items.map((i) => i.id)) : Date.now();
    const newId = maxId + 1;
    const created: Contact = { id: newId, ...data };
    items.push(created);
    this.writeStore(items);
    return created;
  }

  async update(id: number, changes: Partial<Omit<Contact, "id">>): Promise<Contact> {
    const items = this.readStore();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("not_found");
    const updated = { ...items[idx], ...changes };
    items[idx] = updated;
    this.writeStore(items);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const items = this.readStore();
    const filtered = items.filter((i) => i.id !== id);
    this.writeStore(filtered);
  }
}