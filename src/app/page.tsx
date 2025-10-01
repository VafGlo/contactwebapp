"use client";

import CardContact from "./components/CardContact";
import { useContacts } from "./context/contactsContext";

export default function OverviewPage() {
  const { contacts, addFavorite, removeFavorite, deleteContact } = useContacts();

  const favorites = contacts.filter((c) => c.favorite).slice(0, 4);
  const others = contacts.filter((c) => !c.favorite).slice(0, 16);

  return (
    <div className="container">
      <section>
        <h2 className="section-title">Favorites</h2>
        <div className="card-grid">
          {favorites.map((contact) => (
            <CardContact
              key={contact.id}
              name={contact.name}
              email={contact.email}
              isFavorite={true}
              context="overview"
              onRemoveFavorite={() => removeFavorite(contact.id)}
              onDelete={() => deleteContact(contact.id)}
            />
          ))}
        </div>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2 className="section-title">Contact List</h2>
        <div className="card-grid">
          {others.map((contact) => (
            <CardContact
              key={contact.id}
              name={contact.name}
              email={contact.email}
              isFavorite={false}
              context="overview"
              onAddFavorite={() => addFavorite(contact.id)}
              onDelete={() => deleteContact(contact.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// import CardContact from "./components/CardContact";
// import { contactsData } from "./data/contacts";

// export default function OverviewPage() {
//   const favorites = contactsData.filter((c) => c.favorite).slice(0, 4);
//   const others = contactsData.filter((c) => !c.favorite).slice(0, 16);

//   return (
//     <div className="container">
//       <section>
//         <h2 className="section-title">Favorites</h2>
//         <div className="card-grid">
//           {favorites.map((contact) => (
//             <CardContact
//               key={contact.id}
//               name={contact.name}
//               email={contact.email}
//               isFavorite={true}
//             />
//           ))}
//         </div>
//       </section>

// <section style={{ marginTop: "30px" }}>
//         <h2 className="section-title">Contact List</h2>
//         <div className="card-grid">
//           {others.map((contact) => (
//             <CardContact
//               key={contact.id}
//               name={contact.name}
//               email={contact.email}
//               isFavorite={false}
//             />
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }


