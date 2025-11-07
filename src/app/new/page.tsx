"use client";

import { useState } from "react";
import { useContacts } from "../../context/contactsContext";
import styles from "./NewContactForm.module.css";
import CardContact from "../../components/CardContact";
import Modal from "../../components/Modal"; 

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  favorite: boolean;
};

export default function NewContactPage() {
  const { addContact, addFavorite, removeFavorite, deleteContact, contacts } = useContacts();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    favorite: false,
  });

  // id del contacto recién creado (si existe)
  const [createdId, setCreatedId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      alert("Por favor ingresa al menos un nombre o apellido.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Por favor ingresa un email válido.");
      return;
    }

    // Construimos el objeto esperado por el context
    const newContactData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email.trim(),
      favorite: formData.favorite,
    };

    // addContact ahora devuelve el contacto creado con id
    const created = addContact(newContactData);

    //Guardamos el id para mostrar la preview y permitir acciones
    //setCreatedId(created.id);

    //Limpiar el formulario
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      favorite: false,
    });
  };

  // Buscar el contacto creado en el estado global (se mantiene sincronizado)
  const createdContact = createdId ? contacts.find((c) => c.id === createdId) ?? null : null;

  // Helpers locales para que la preview actualice createdContact si cambia
  const handlePreviewAddFavorite = (id: number) => {
    addFavorite(id);
  };
  const handlePreviewRemoveFavorite = (id: number) => {
    removeFavorite(id);
  };
  const handlePreviewDelete = (id: number) => {
    deleteContact(id);
    setCreatedId(null); // si se elimina, cerramos modal
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.checkboxGroup}>
          <label htmlFor="favorite">Enable like favorite</label>
          <input
            id="favorite"
            type="checkbox"
            name="favorite"
            checked={formData.favorite}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.button}>
          SAVE
        </button>
      </form>

      {/* Preview como Modal */}
      {createdContact && (
        <Modal onClose={() => setCreatedId(null)}>
          <CardContact
            name={createdContact.name}
            email={createdContact.email}
            isFavorite={createdContact.favorite}
            context="preview"
          />
        </Modal>
      )}
    </div>
  );
}





