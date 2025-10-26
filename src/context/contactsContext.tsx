"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} 

from "react";
import { useAuth } from "@/context/authContext";
import {
  IContactRepository,
  ApiContactRepository,
  LocalContactRepository,
  Contact as RepoContact,
} 

from "@/services/contactRepository";

// Definición del tipo de contacto (coincide con services/contactRepository)
export type Contact = RepoContact;

type ContactsContextType = {
  contacts: Contact[];
  addFavorite: (id: number) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  addContact: (newContact: Omit<Contact, "id">) => Promise<Contact>;
  updateContact: (id: number, changes: Partial<Omit<Contact, "id">>) => Promise<void>;
  reloadFromApi: () => Promise<void>;
};

// Crear contexto
const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export const useContacts = () => {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error("useContacts debe usarse dentro de ContactsProvider");
  return ctx;
};

// Proveedor de contactos -> lo coge de data
export const ContactsProvider = ({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: IContactRepository;
}) => {
  const { user } = useAuth();
  // elegir implementación: si hay user -> LocalContactRepository(userId), si no -> ApiContactRepository
  const repoInstance = useMemo<IContactRepository>(() => {
    if (repository) return repository;
    if (user) return new LocalContactRepository(user.id, new ApiContactRepository());
    return new ApiContactRepository();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, repository]);

  const [contacts, setContacts] = useState<Contact[]>([]);

  // Cargar datos desde reqres al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const items = await repoInstance.getAll();
        if (!mounted) return;
        setContacts(items);
      } catch (err) {
        console.error("Error cargando contactos:", err);
        setContacts([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [repoInstance, user]);

  // Marcar contacto como favorito
  const addFavorite = async (id: number) => {
    await repoInstance.update(id, { favorite: true });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: true } : c)));
  };

  // Quitar contacto de favoritos
  const removeFavorite = async (id: number) => {
    await repoInstance.update(id, { favorite: false });
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: false } : c)));
  };

  // Eliminar contacto de la lista
  const deleteContact = async (id: number) => {
    await repoInstance.delete(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Agregar nuevo contacto - ahora devuelve el Contact creado (con id)
  const addContact = async (newContact: Omit<Contact, "id">): Promise<Contact> => {
    const created = await repoInstance.create(newContact);
    setContacts((prev) => [...prev, created]);
    return created;
  };

  // Actualizar contacto
  const updateContact = async (id: number, changes: Partial<Omit<Contact, "id">>) => {
    const updated = await repoInstance.update(id, changes);
    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  // Recargar datos desde la API
  const reloadFromApi = async () => {
    // forzar recarga desde servidor via ApiContactRepository
    const api = new ApiContactRepository();
    const items = await api.getAll();
    setContacts(items);
    // si estamos usando LocalContactRepository, también actualizar storage
    if (user) {
      const local = new LocalContactRepository(user.id);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      (async () => {
        // overwrite local with fresh data
        const _ = await local.getAll(); // getAll will init local if empty
        local['writeStore']?.(items as any); // best-effort: persist new array (writeStore is private, but keep local in sync via create/update if needed)
      })();
    }
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, addFavorite, removeFavorite, deleteContact, addContact, updateContact, reloadFromApi }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

//--------------------------------------------------------------------------------------------

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";
// import { fetchAllReqresUsers } from "../lib/reqres";
// import type { ReqresUser } from "../lib/reqres";
// import type { Contact as ContactType } from "../data/contacts";
// import { useAuth } from "./authContext";

// // Definición del tipo de contacto
// export type Contact = {
//   id: number;
//   name: string;
//   email: string;
//   favorite: boolean;
// };

// // Definición del tipo de contexto
// type ContactsContextType = {
//   contacts: ContactType[];
//   addFavorite: (id: number) => void;
//   removeFavorite: (id: number) => void;
//   deleteContact: (id: number) => void;
//   addContact: (newContact: Omit<ContactType, "id">) => ContactType;
//   // opcional: exponer una recarga
//   reloadFromApi: () => Promise<void>;
// };

// // helper para key en localStorage
// const storageKeyFor = (userId: string) => `contacts:${userId}`;

// // Crear contexto
// const ContactsContext = createContext<ContactsContextType | undefined>(
//   undefined
// );

// // Hook para usar el contexto
// export const useContacts = () => {
//   const ctx = useContext(ContactsContext);
//   if (!ctx) throw new Error("useContacts debe usarse dentro de ContactsProvider");
//   return ctx;
// };

// // Proveedor de contactos -> lo coge de data
// export const ContactsProvider = ({ children }: { children: ReactNode }) => {
//   const { user } = useAuth(); // <-- obtener user
//   const [contacts, setContacts] = useState<ContactType[]>([]);

//   // Cargar datos desde reqres al montar
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       // Si hay usuario, cargar desde localStorage (persistencia por cuenta) o fallback a la API
//       if (user) {
//         try {
//           const raw = localStorage.getItem(storageKeyFor(user.id));
//           if (raw) {
//             const saved = JSON.parse(raw) as ContactType[];
//             if (mounted) {
//               setContacts(saved);
//               return;
//             }
//           }
//         } catch {
//           // ignore
//         }

//         try {
//           const users: ReqresUser[] = await fetchAllReqresUsers();
//           if (!mounted) return;
//           const mapped = users.map((u) => {
//             const first = (u.first_name ?? "").toString().trim();
//             const last = (u.last_name ?? "").toString().trim();
//             const nameFromParts = [first, last].filter(Boolean).join(" ");
//             const name = (u.name && u.name.toString().trim()) || nameFromParts || u.email || "";
//             return {
//               id: u.id,
//               name,
//               email: u.email,
//               favorite: !!u.favorite,
//             } as ContactType;
//           });
//           setContacts(mapped);
//         } catch (err) {
//           console.error("Error cargando desde reqres:", err);
//           setContacts([]);
//         }
//         return;
//       }

//       // Si NO hay usuario: cargar contactos públicos desde la API (no persistir)
//       try {
//         const users: ReqresUser[] = await fetchAllReqresUsers();
//         if (!mounted) return;
//         const mapped = users.map((u) => {
//           const first = (u.first_name ?? "").toString().trim();
//           const last = (u.last_name ?? "").toString().trim();
//           const nameFromParts = [first, last].filter(Boolean).join(" ");
//           const name = (u.name && u.name.toString().trim()) || nameFromParts || u.email || "";
//           return {
//             id: u.id,
//             name,
//             email: u.email,
//             favorite: !!u.favorite,
//           } as ContactType;
//         });
//         setContacts(mapped);
//       } catch (err) {
//         console.error("Error cargando desde reqres (public):", err);
//         setContacts([]);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [user]);

//   // Marcar contacto como favorito
//   const addFavorite = (id: number) =>
//     setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: true } : c)));

//   // Quitar contacto de favoritos
//   const removeFavorite = (id: number) =>
//     setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: false } : c)));

//   // Eliminar contacto de la lista
//   const deleteContact = (id: number) => setContacts((prev) => prev.filter((c) => c.id !== id));

//   // Agregar nuevo contacto - ahora devuelve el Contact creado (con id)
//   const addContact = (newContact: Omit<ContactType, "id">): ContactType => {
//     const newId =
//       contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;
//     const created: ContactType = { id: newId, ...newContact };
//     setContacts((prev) => [...prev, created]);
//     return created;
//   };

//   // Recargar datos desde la API
//   const reloadFromApi = async () => {
//     try {
//       const users = await fetchAllReqresUsers();
//       const mapped = users.map((u) => ({
//         id: u.id,
//         name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.name || u.email,
//         email: u.email,
//         favorite: false,
//       }));
//       setContacts(mapped);
//     } catch (err) {
//       console.error("Error recargando desde reqres:", err);
//       throw err;
//     }
//   };

//   return (
//     <ContactsContext.Provider
//       value={{ contacts, addFavorite, removeFavorite, deleteContact, addContact, reloadFromApi }}
//     >
//       {children}
//     </ContactsContext.Provider>
//   );
// };



