"use client";

import { useState } from "react";
import CardContact from "../components/CardContact";
import { useContacts } from "../context/contactsContext";

export default function ContactsPage() {
  const { contacts, addFavorite, removeFavorite, deleteContact } = useContacts();

  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 12;

  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(contacts.length / contactsPerPage);

  return (
    <div className="container">
      <h2 className="section-title">All Contacts</h2>

      <div className="card-grid">
        {currentContacts.map((contact) => (
          <CardContact
            key={contact.id}
            name={contact.name}
            email={contact.email}
            isFavorite={contact.favorite}
            context="contacts"
            onAddFavorite={() => addFavorite(contact.id)}
            onRemoveFavorite={() => removeFavorite(contact.id)}
            onDelete={() => deleteContact(contact.id)}
          />
        ))}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <span>
          {currentPage} de {totalPages}
        </span>

        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
          ‹
        </button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
          ›
        </button>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import CardContact from "../components/CardContact";
// import { contactsData, Contact } from "../data/contacts";

// export default function ContactsPage() {
//   const [contacts, setContacts] = useState<Contact[]>(contactsData);
//   const [currentPage, setCurrentPage] = useState(1);
//   const contactsPerPage = 12;

//   //  Agregar a favoritos
//   const handleAddFavorite = (id: number) => {
//     setContacts(
//       contacts.map((c) =>
//         c.id === id ? { ...c, favorite: true } : c
//       )
//     );
//   };

//   //  Quitar de favoritos
//   const handleRemoveFavorite = (id: number) => {
//     setContacts(
//       contacts.map((c) =>
//         c.id === id ? { ...c, favorite: false } : c
//       )
//     );
//   };

//   //  Eliminar contacto (opcional)
//   const handleDeleteContact = (id: number) => {
//     setContacts(contacts.filter((c) => c.id !== id));
//   };

//   // Calcular rango para paginación
//   const indexOfLast = currentPage * contactsPerPage;
//   const indexOfFirst = indexOfLast - contactsPerPage;
//   const currentContacts = contacts.slice(indexOfFirst, indexOfLast);

//   //Total de páginas
//   const totalPages = Math.ceil(contacts.length / contactsPerPage);

//   return (
//     <div className="container">
//       <h2 className="section-title">All Contacts</h2>

//       {/* Render contactos paginados */}
//       <div className="card-grid">
//         {currentContacts.map((contact) => (
//           <CardContact
//             key={contact.id}
//             name={contact.name}
//             email={contact.email}
//             isFavorite={contact.favorite}
//             context="contacts"
//             onAddFavorite={() => handleAddFavorite(contact.id)}
//             onRemoveFavorite={() => handleRemoveFavorite(contact.id)}
//             onDelete={() => handleDeleteContact(contact.id)}
//           />
//         ))}
//       </div>

//       {/* Controles de paginación */}
//       <div className="pagination">
//         <span>
//           {currentPage} de {totalPages}
//         </span>

//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => p - 1)}
//         >
//           ‹
//         </button>

//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => setCurrentPage((p) => p + 1)}
//         >
//           ›
//         </button>
//       </div>
//     </div>
//   );
// }


