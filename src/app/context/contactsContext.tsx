"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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
  addContact: (newContact: Omit<Contact, "id">) => void;
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

// Proveedor de contactos
export const ContactsProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", favorite: false },
    { id: 2, name: "María López", email: "maria@example.com", favorite: true },
    { id: 3, name: "Carlos Gómez", email: "carlos@example.com", favorite: false },
  ]);

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

  // Agregar nuevo contacto
  const addContact = (newContact: Omit<Contact, "id">) => {
    setContacts((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1, // genera un id incremental
        ...newContact,
      },
    ]);
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

// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import { contactsData, Contact } from "../data/contacts";

// type ContactsContextType = {
//   contacts: Contact[];
//   addFavorite: (id: number) => void;
//   removeFavorite: (id: number) => void;
//   deleteContact: (id: number) => void;
// };

// const ContactsContext = createContext<ContactsContextType | undefined>(
//   undefined
// );

// export const ContactsProvider = ({ children }: { children: ReactNode }) => {
//   const [contacts, setContacts] = useState<Contact[]>(contactsData);

//   const addFavorite = (id: number) => {
//     setContacts((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, favorite: true } : c))
//     );
//   };

//   const removeFavorite = (id: number) => {
//     setContacts((prev) =>
//       prev.map((c) => (c.id === id ? { ...c, favorite: false } : c))
//     );
//   };

//   const deleteContact = (id: number) => {
//     setContacts((prev) => prev.filter((c) => c.id !== id));
//   };

//   return (
//     <ContactsContext.Provider
//       value={{ contacts, addFavorite, removeFavorite, deleteContact }}
//     >
//       {children}
//     </ContactsContext.Provider>
//   );
// };

// export const useContacts = () => {
//   const context = useContext(ContactsContext);
//   if (!context) {
//     throw new Error("useContacts debe usarse dentro de ContactsProvider");
//   }
//   return context;
// };