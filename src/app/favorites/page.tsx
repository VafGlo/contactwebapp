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

  const totalPages = Math.max(1, Math.ceil(favoriteContacts.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentContacts = favoriteContacts.slice(indexOfFirst, indexOfLast);

    //Evita avanzar o retroceder fuera del rango
  const handleNext = () => {
    setCurrentPage((p) => Math.min(p + 1, totalPages));
  };

  const handlePrev = () => {
    setCurrentPage((p) => Math.max(p - 1, 1));
  };

  // Si cambian los contactos y la página actual queda fuera de rango, la reiniciamos
  if (currentPage > totalPages) setCurrentPage(totalPages);

  return (
   <div className="container">
      <h2 className="section-title">Favorite Contacts</h2>

      {/* ✅ Si no hay favoritos */}
      {favoriteContacts.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
          You don’t have any favorite contacts yet
        </p>
      ) : (
        <>
          {/* Lista de favoritos */}
          <div className="card-grid">
            {currentContacts.length > 0 ? (
              currentContacts.map((contact) => (
                <CardContact
                  key={contact.id}
                  name={contact.name}
                  email={contact.email}
                  isFavorite={contact.favorite}
                  context="favorites"
                  onRemoveFavorite={() => removeFavorite(contact.id)}
                  onDelete={() => deleteContact(contact.id)}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
                No more contacts to display on this page.
              </p>
            )}
          </div>

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </>
      )}
    </div>
  );
}

