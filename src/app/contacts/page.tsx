"use client";
import { useState } from "react";
import CardContact from "../components/CardContact";
import { contactsData } from "../data/contacts";
import styles from "./Contacts.module.css";

export default function ContactsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 15;

  // Calcular rango
  const indexOfLast = currentPage * contactsPerPage;
  const indexOfFirst = indexOfLast - contactsPerPage;
  const currentContacts = contactsData.slice(indexOfFirst, indexOfLast);

  // Total de páginas
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
          />
        ))}
      </div>

      {/* Controles de paginación */}
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          ⬅ 
        </button>

        <span>
          Página {currentPage} de {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
           ➡
        </button>
      </div>
    </div>
  );
}
