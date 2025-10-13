"use client";
import styles from "./CardContact.module.css";

type CardContactProps = {
  name: string;
  email: string;
  isFavorite?: boolean;
  onAddFavorite?: () => void;
  onRemoveFavorite?: () => void;
  onDelete?: () => void;
  context?: "contacts" | "overview" | "favorites" | "preview"; 
};

export default function CardContact({
  name,
  email,
  isFavorite = false,
  onAddFavorite,
  onRemoveFavorite,
  onDelete,
  context = "overview",
}: CardContactProps) {
  return (
    <div className={styles.card}>
      <div
        className={`${styles.avatar} ${isFavorite ? styles.favoriteBorder : ""}`}
      >
        <img src="/contactLogo.png" alt={`${name} avatar`} />
      </div>

      <h3>{name}</h3>
      <p>{email}</p>

      {/* 🔹 Ocultamos botones si es contexto preview */}
      {context !== "preview" && (
        <div className={styles.actions}>
          {/*Lógica según página */}
          {context === "contacts" ? (
            <>
              {isFavorite ? (
                // Si ES favorito, estos botones -> ❌ + 🗑️ 
                <>
                  <button
                    className={styles.brokenHeartBtn}
                    onClick={onRemoveFavorite}
                    title="Quitar de favoritos"
                  >
                    ❌
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
                // Si NO es favorito, estos botones -> 💚 + 🗑️ 
                <>
                  <button
                    className={styles.favoriteBtn}
                    onClick={onAddFavorite}
                    title="Añadir a favoritos"
                  >
                    💚
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
            </>
          ) : (
            // Comportamiento (REMOVE) si es favorito y esta en overview
            <>
              {isFavorite ? (
                <button
                  className={styles.brokenHeartBtn}
                  onClick={onRemoveFavorite}
                  title="Quitar de favoritos"
                >
                  X REMOVE
                </button>
              ) : (
                //Comportamiento (Solo 💚) si es NO es favorito y esta en overview 
                <>
                  <button
                    className={styles.favoriteBtn}
                    onClick={onAddFavorite}
                    title="Añadir a favoritos"
                  >
                    💚
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


// "use client";
// import styles from "./CardContact.module.css";

// type CardContactProps = {
//   name: string;
//   email: string;
//   isFavorite?: boolean;
//   onAddFavorite?: () => void;
//   onRemoveFavorite?: () => void;
//   onDelete?: () => void;
//   context?: "contacts" | "overview" | "favorites" | "preview"; // prop para saber en donde esta (vista)
// };

// export default function CardContact({
//   name,
//   email,
//   isFavorite = false,
//   onAddFavorite,
//   onRemoveFavorite,
//   onDelete,
//   context = "overview",
// }: CardContactProps) {
//   return (
//     <div className={styles.card}>
//       <div
//         className={`${styles.avatar} ${isFavorite ? styles.favoriteBorder : ""}`}
//       >
//         <img src="/contactLogo.png" alt={`${name} avatar`} />
//       </div>

//       <h3>{name}</h3>
//       <p>{email}</p>

//       <div className={styles.actions}>
//         {/*Lógica según página */}
//         {context === "contacts" ? (
//           <>
//             {isFavorite ? (
//               // Si ES favorito, estos botones -> ❌ + 🗑️ 
//               <>
//                 <button
//                   className={styles.brokenHeartBtn}
//                   onClick={onRemoveFavorite}
//                   title="Quitar de favoritos"
//                 >
//                   ❌
//                 </button>
//                 <button
//                   className={styles.deleteBtn}
//                   onClick={onDelete}
//                   title="Eliminar contacto"
//                 >
//                   🗑️
//                 </button>
//               </>
//             ) : (
//               // Si NO es favorito, estos botones -> 💚 + 🗑️ 
//               <>
//                 <button
//                   className={styles.favoriteBtn}
//                   onClick={onAddFavorite}
//                   title="Añadir a favoritos"
//                 >
//                   💚
//                 </button>
//                 <button
//                   className={styles.deleteBtn}
//                   onClick={onDelete}
//                   title="Eliminar contacto"
//                 >
//                   🗑️
//                 </button>
//               </>
//             )}
//           </>
//         ) : (
//           // Comportamiento (REMOVE) si es favorito y esta en overview
//           <>
//             {isFavorite ? (
//               <button
//                 className={styles.brokenHeartBtn}
//                 onClick={onRemoveFavorite}
//                 title="Quitar de favoritos"
//               >
//                 X REMOVE
//               </button>
//             ) : (
//               //Comportamiento (Solo 💚) si es NO es favorito y esta en overview 
//               <>
//                 <button
//                   className={styles.favoriteBtn}
//                   onClick={onAddFavorite}
//                   title="Añadir a favoritos"
//                 >
//                   💚
//                 </button>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

