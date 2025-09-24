"use client";

import { useState } from "react";
import CardContact from "../components/CardContact";
import { contactsData } from "../data/contacts";

export default function FavoritesPage() {
  // Filtramos solo favoritos
  const favoriteContacts = contactsData.filter((c) => c.favorite);

  // Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  // Calcular el rango de contactos que se muestran
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
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ⬅ 
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
            ➡
        </button>
      </div>
    </div>
  );
}
