"use client";

import { useState } from "react";
import styles from "./NewContactForm.module.css";

export default function NewContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    favorite: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nuevo contacto:", formData);
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
    </div>
  );
}
