const API_URL = "https://reqres.in/api/users";

export async function fetchContacts(page = 1) {
  const res = await fetch(`${API_URL}?page=${page}`);
  if (!res.ok) throw new Error("Error al obtener contactos");
  const data = await res.json();
  return data.data; // la API devuelve los usuarios en "data"
}

export async function addToFavorites(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorite: true }),
  });
  return res.json();
}

export async function removeFromFavorites(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favorite: false }),
  });
  return res.json();
}

export async function deleteContact(id: number) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return res.ok; // devuelve true si eliminó bien
}
