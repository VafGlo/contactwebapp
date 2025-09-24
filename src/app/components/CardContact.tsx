"use client";
import styles from "./CardContact.module.css";

type CardContactProps = {
  name: string;
  email: string;
  isFavorite?: boolean;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
  onDelete?: () => void;
};

export default function CardContact({
  name,
  email,
  isFavorite = false,
  onAddFavorite,
  onRemoveFavorite,
  onDelete,
}: CardContactProps) {
  return (

    <div className={styles.card}>
    {/* Avatar con borde condicional */}
      <div
        className={`${styles.avatar} ${isFavorite ? styles.favoriteBorder : ""}`}
      >
        <img src="/contactLogo.png" alt={`${name} avatar`} />
      </div>
      
      <h3>{name}</h3>
      <p>{email}</p>

      <div className={styles.actions}>
        {isFavorite ? (
          <>
          <button
            className={styles.brokenHeartBtn}
            onClick={onRemoveFavorite}
            title="Quitar de favoritos"
          >
            💔
          </button>
          <button
              className={styles.deleteBtn}
              onClick={onDelete}
              title="Eliminar contacto"
            >
              🗑️
            </button>
          </>
          
        ) : (
          <>
            <button
              className={styles.favoriteBtn}
              onClick={onAddFavorite}
              title="Añadir a favoritos"
            >
              ❤️
            </button>
            <button
              className={styles.deleteBtn}
              onClick={onDelete}
              title="Eliminar contacto"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
