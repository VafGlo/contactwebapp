export async function GET() {
  const fetchPageDirect = async (page: number) => {
    const url = `https://reqres.in/api/users?page=${page}`;
    try {
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          // forzar origin/user-agent para evitar que algún gateway bloquee
          Origin: "http://localhost:5173",
          "User-Agent": "contactwebapp/1.0 (+https://localhost)",
        },
      });
      const text = await res.text().catch(() => "");
      if (!res.ok) {
        return { ok: false, status: res.status, body: text };
      }
      return { ok: true, data: JSON.parse(text) };
    } catch (err: any) {
      return { ok: false, status: 0, body: String(err?.message ?? err) };
    }
  };

  const fetchPageViaAllOrigins = async (page: number) => {
    const upstream = `https://reqres.in/api/users?page=${page}`;
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(upstream)}`;
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const text = await res.text().catch(() => "");
      if (!res.ok) return { ok: false, status: res.status, body: text };
      return { ok: true, data: JSON.parse(text) };
    } catch (err: any) {
      return { ok: false, status: 0, body: String(err?.message ?? err) };
    }
  };

  try {
    // intentar primero la llamada directa
    const first = await fetchPageDirect(1);
    if (!first.ok) {
      // si upstream devuelve 401 con Missing API key, usar fallback
      const bodyStr = String(first.body ?? "");
      if (first.status === 401 || /Missing API key/i.test(bodyStr)) {
        // intentar via allorigins
        const f = await fetchPageViaAllOrigins(1);
        if (!f.ok) {
          return new Response(JSON.stringify({ error: "upstream_failed", via: "allorigins", status: f.status, body: f.body }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }
        const totalPages = (f.data?.total_pages ?? 1) as number;
        const users = [...(f.data?.data ?? [])];

        for (let p = 2; p <= totalPages; p++) {
          const pageRes = await fetchPageViaAllOrigins(p);
          if (!pageRes.ok) {
            return new Response(JSON.stringify({ error: "upstream_failed", page: p, via: "allorigins", status: pageRes.status, body: pageRes.body }), {
              status: 502,
              headers: { "Content-Type": "application/json" },
            });
          }
          users.push(...(pageRes.data?.data ?? []));
        }

        return new Response(JSON.stringify({ data: users }), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // si falla por otra razón, devolver info para depuración
      return new Response(JSON.stringify({ error: "upstream_failed", status: first.status, body: first.body }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // caso OK directo
    const totalPages = (first.data?.total_pages ?? 1) as number;
    const users = [...(first.data?.data ?? [])];

    for (let p = 2; p <= totalPages; p++) {
      const pageRes = await fetchPageDirect(p);
      if (!pageRes.ok) {
        // intentar fallback para páginas posteriores
        const fallback = await fetchPageViaAllOrigins(p);
        if (!fallback.ok) {
          return new Response(JSON.stringify({ error: "upstream_failed", page: p, status: pageRes.status, body: pageRes.body }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
          });
        }
        users.push(...(fallback.data?.data ?? []));
        continue;
      }
      users.push(...(pageRes.data?.data ?? []));
    }

    return new Response(JSON.stringify({ data: users }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "internal", message: String(err?.message ?? err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}