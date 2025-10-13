"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { fetchAllReqresUsers } from "../lib/reqres";
import type { ReqresUser } from "../lib/reqres";
import type { Contact as ContactType } from "../data/contacts";

// Definición del tipo de contacto
export type Contact = {
  id: number;
  name: string;
  email: string;
  favorite: boolean;
};

// Definición del tipo de contexto
type ContactsContextType = {
  contacts: ContactType[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  deleteContact: (id: number) => void;
  addContact: (newContact: Omit<ContactType, "id">) => ContactType;
  // opcional: exponer una recarga
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
export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<ContactType[]>([]);

  // Cargar datos desde reqres al montar
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const users: ReqresUser[] = await fetchAllReqresUsers();
        if (!mounted) return;
        const mapped = users.map((u) => ({
          id: u.id,
          name: `${u.first_name} ${u.last_name}`,
          email: u.email,
          favorite: false,
        }));
        setContacts(mapped);
      } catch (err) {
        console.error("Error cargando usuarios desde reqres:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Marcar contacto como favorito
  const addFavorite = (id: number) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: true } : c)));

  // Quitar contacto de favoritos
  const removeFavorite = (id: number) =>
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, favorite: false } : c)));

  // Eliminar contacto de la lista
  const deleteContact = (id: number) => setContacts((prev) => prev.filter((c) => c.id !== id));

  // Agregar nuevo contacto - ahora devuelve el Contact creado (con id)
  const addContact = (newContact: Omit<ContactType, "id">): ContactType => {
    const newId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;
    const created: ContactType = { id: newId, ...newContact };
    setContacts((prev) => [...prev, created]);
    return created;
  };

  // Recargar datos desde la API
  const reloadFromApi = async () => {
    try {
      const users = await fetchAllReqresUsers();
      const mapped = users.map((u) => ({
        id: u.id,
        name: `${u.first_name} ${u.last_name}`,
        email: u.email,
        favorite: false,
      }));
      setContacts(mapped);
    } catch (err) {
      console.error("Error recargando desde reqres:", err);
      throw err;
    }
  };

  return (
    <ContactsContext.Provider
      value={{ contacts, addFavorite, removeFavorite, deleteContact, addContact, reloadFromApi }}
    >
      {children}
    </ContactsContext.Provider>
  );
};




