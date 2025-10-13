"use client";

import { useState } from "react";
import CardContact from "../../components/CardContact";
import { useContacts } from "../../context/contactsContext";
import Pagination from "../../components/pagination";

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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
        />
    </div>
  );
}



