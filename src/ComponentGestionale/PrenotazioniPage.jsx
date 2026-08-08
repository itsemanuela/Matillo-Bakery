import { useState, useEffect } from "react";

export default function PrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/prenotazioni", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
        return res.json();
      })
      .then((data) => {
        setPrenotazioni(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCancella = (id) => {
    fetch(`http://localhost:3001/api/prenotazioni/${id}/cancella`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante la cancellazione");
        return res.json();
      })
      .then((updated) => {
        // Aggiorna lo stato locale per riflettere la cancellazione
        setPrenotazioni((prev) =>
          prev.map((p) => (p.id === id ? { ...p, stato: "CANCELLATA" } : p)),
        );
      })
      .catch((err) => alert(err.message));
  };

  if (loading)
    return <div className="text-center p-5">Caricamento prenotazioni...</div>;
  if (error) return <div className="alert alert-danger">Errore: {error}</div>;

  return (
    <div className="container my-4">
      <h2 className="mb-4">Gestione Prenotazioni Laboratori</h2>

      {prenotazioni.length === 0 ? (
        <p className="text-muted">Nessuna prenotazione trovata.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Laboratorio</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Persone</th>
                <th>Stato</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {prenotazioni.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.laboratorio
                      ? p.laboratorio.nome
                      : "Laboratorio non disponibile"}
                  </td>
                  <td>
                    {p.nomeCliente} {p.cognomeCliente}
                  </td>
                  <td>{p.emailCliente}</td>
                  <td>{p.numeroPersone}</td>
                  <td>
                    <span
                      className={`badge ${p.stato === "CANCELLATA" ? "bg-danger" : "bg-success"}`}
                    >
                      {p.stato}
                    </span>
                  </td>
                  <td>
                    {p.stato !== "CANCELLATA" && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleCancella(p.id)}
                      >
                        Cancella
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
