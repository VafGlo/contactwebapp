import CardContact from "./components/CardContact";
import { contactsData } from "./data/contacts";

export default function OverviewPage() {
  const favorites = contactsData.filter((c) => c.favorite).slice(0, 4);
  const others = contactsData.filter((c) => !c.favorite).slice(0, 16);

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
            />
          ))}
        </div>
      </section>
    </div>
  );
}


