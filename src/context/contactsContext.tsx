"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { contactsData } from "@/data/contacts";

// Definición del tipo de contacto
export type Contact = {
  id: number;
  name: string;
  email: string;
  favorite: boolean;
};

// Definición del tipo de contexto
type ContactsContextType = {
  contacts: Contact[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  deleteContact: (id: number) => void;
  addContact: (newContact: Omit<Contact, "id">) => Contact; // retorna Contact
};

// Crear contexto
const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};

// Proveedor de contactos -> lo coge de data
export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>(contactsData);

  // Marcar contacto como favorito
  const addFavorite = (id: number) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: true } : c))
    );
  };

  // Quitar contacto de favoritos
  const removeFavorite = (id: number) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: false } : c))
    );
  };

  // Eliminar contacto de la lista
  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Agregar nuevo contacto - ahora devuelve el Contact creado (con id)
  const addContact = (newContact: Omit<Contact, "id">): Contact => {
    // Generar id basado en el array actual (sencillo, incremental)
    const newId = contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1;
    const created: Contact = { id: newId, ...newContact };
    setContacts((prev) => [...prev, created]);
    return created;
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        addFavorite,
        removeFavorite,
        deleteContact,
        addContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};


