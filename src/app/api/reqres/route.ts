// Esta ruta ya no se usa, la API real está en /server


// export async function GET() {
//   try {
//     const res = await fetch("https://jsonplaceholder.typicode.com/users");
//     if (!res.ok) throw new Error("API fetch failed");

//     const users = await res.json();

//     const mapped = users.map((u: any) => ({
//       id: u.id,
//       email: u.email,
//       first_name: u.name.split(" ")[0],
//       last_name: u.name.split(" ").slice(1).join(" "),
//       avatar: `https://i.pravatar.cc/150?img=${u.id}`, 
//     }));

//     return new Response(JSON.stringify({ data: mapped }), {
//       headers: { "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (err: any) {
//     console.error("Error fetching users:", err);
//     return new Response(
//       JSON.stringify({ error: "Failed to load users", details: err.message }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }



// export async function GET() {
//   const fetchPage = async (p: number) => {
//     const r = await fetch(`https://reqres.in/api/users?page=${p}`);
//     if (!r.ok) throw new Error(`reqres fetch failed: ${r.status}`);
//     return r.json();
//   };

//   const first = await fetchPage(1);
//   const totalPages = first.total_pages ?? 1;
//   const users = [...first.data];

//   for (let p = 2; p <= totalPages; p++) {
//     try {
//       const page = await fetchPage(p);
//       users.push(...page.data);
//     } catch {
//       // si falla una página, se continúa con lo que haya
//       break;
//     }
//   }

//   return new Response(JSON.stringify({ data: users }), {
//     headers: { "Content-Type": "application/json" },
//   });
// }