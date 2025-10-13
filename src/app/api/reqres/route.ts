export async function GET() {
  const fetchPage = async (p: number) => {
    const r = await fetch(`https://reqres.in/api/users?page=${p}`);
    if (!r.ok) throw new Error(`reqres fetch failed: ${r.status}`);
    return r.json();
  };

  const first = await fetchPage(1);
  const totalPages = first.total_pages ?? 1;
  const users = [...first.data];

  for (let p = 2; p <= totalPages; p++) {
    try {
      const page = await fetchPage(p);
      users.push(...page.data);
    } catch {
      // si falla una página, se continúa con lo que haya
      break;
    }
  }

  return new Response(JSON.stringify({ data: users }), {
    headers: { "Content-Type": "application/json" },
  });
}