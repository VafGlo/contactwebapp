"use client";

import { useState } from "react";
import CardContact from "../../components/CardContact";
import { useContacts } from "../../context/contactsContext";

export default function FavoritesPage() {
  const { contacts, removeFavorite, deleteContact } = useContacts();

  // Filtramos solo favoritos
  const favoriteContacts = contacts.filter((c) => c.favorite);

  // Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentContacts = favoriteContacts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(favoriteContacts.length / itemsPerPage);

  return (
    <div className="container">
      <h2 className="section-title">Favorite Contacts</h2>

      <div className="card-grid">
        {currentContacts.map((contact) => (
          <CardContact
            key={contact.id}
            name={contact.name}
            email={contact.email}
            isFavorite={contact.favorite}
            context="favorites"
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

// export default function FavoritesPage() {
//   // Guardamos en estado solo los favoritos iniciales
//   const [favorites, setFavorites] = useState<Contact[]>(
//     contactsData.filter((c) => c.favorite)
//   );

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 12;

//   //  Agregar (en favoritos no lo usarías mucho, pero lo dejo por consistencia)
//   const handleAddFavorite = (id: number) => {
//     setFavorites(
//       favorites.map((c) =>
//         c.id === id ? { ...c, favorite: true } : c
//       )
//     );
//   };

//   //  Quitar de favoritos → eliminar de la lista
//   const handleRemoveFavorite = (id: number) => {
//     setFavorites(favorites.filter((c) => c.id !== id));
//   };

//   //  Eliminar contacto de favoritos
//   const handleDeleteContact = (id: number) => {
//     setFavorites(favorites.filter((c) => c.id !== id));
//   };

//   // Calcular rango para paginación
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentContacts = favorites.slice(indexOfFirst, indexOfLast);

//   const totalPages = Math.ceil(favorites.length / itemsPerPage);

//   return (
//     <div className="container">
//       <h2 className="section-title">Favorite Contacts</h2>

//       <div className="card-grid">
//         {currentContacts.map((contact) => (
//           <CardContact
//             key={contact.id}
//             name={contact.name}
//             email={contact.email}
//             isFavorite={contact.favorite}
//             context="favorites"
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
