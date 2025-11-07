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

// Proveedor de contactos
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





