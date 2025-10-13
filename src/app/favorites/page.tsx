"use client";

import { useState } from "react";
import CardContact from "../../components/CardContact";
import { useContacts } from "../../context/contactsContext";
import Pagination from "../../components/pagination";

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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
        />
    </div>
  );
}

