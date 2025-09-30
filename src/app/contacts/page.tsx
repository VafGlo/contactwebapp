"use client";
import { useState } from "react";
import CardContact from "../components/CardContact";
import { contactsData } from "../data/contacts";

export default function ContactsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 12;

  // Calcular rango
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = contactsData.slice(indexOfFirst, indexOfLast);

  //Total de paginas
  const totalPages = Math.ceil(contactsData.length / contactsPerPage);

  return (
    <div className="container">
      <h2 className="section-title">All Contacts</h2>

      {/* Render contactos paginados */}
      <div className="card-grid">
        {currentContacts.map((contact) => (
          <CardContact
            key={contact.id}
            name={contact.name}
            email={contact.email}
            isFavorite={contact.favorite}
            context="contacts" // Aca esta mirando que este en la vista de contactos
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="pagination">
        <span>
          {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ‹
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
