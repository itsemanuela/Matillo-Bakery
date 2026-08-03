import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

const API_URL = "http://localhost:3001/api";

const STATI = [
  "IN_ELABORAZIONE",
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "CANCELLATO",
];

// Colore badge per ogni stato
const COLORE_STATO = {
  IN_ELABORAZIONE: "#EED972",
  PAGATO: "#8fd1c7",
  IN_PREPARAZIONE: "#8fb8d1",
  SPEDITO: "#c78fd1",
  CONSEGNATO: "#8fd19e",
  CANCELLATO: "#e08585",
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AdminOrdini() {
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);
  const [aggiornandoId, setAggiornandoId] = useState(null);
  const [filtroStato, setFiltroStato] = useState("TUTTI");

  const caricaOrdini = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/ordini`, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento degli ordini");
        return res.json();
      })
      .then((data) => {
        // Più recenti prima
        const ordinati = [...data].sort(
          (a, b) => new Date(b.dataOrdine) - new Date(a.dataOrdine),
        );
        setOrdini(ordinati);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaOrdini(false);
  }, []);

  const handleStatoChange = (id, nuovoStato) => {
    setAggiornandoId(id);
    setErrore(null);

    fetch(`${API_URL}/ordini/${id}/stato`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ stato: nuovoStato }),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante l'aggiornamento dello stato");
        return res.json();
      })
      .then(() => {
        setMessaggio("Stato aggiornato.");
        caricaOrdini(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setAggiornandoId(null));
  };

  const nomeCliente = (ordine) => {
    if (ordine.utente) {
      return `${ordine.utente.nome} ${ordine.utente.cognome ?? ""}`.trim();
    }
    return (
      `${ordine.nomeCliente ?? ""} ${ordine.cognomeCliente ?? ""}`.trim() || "—"
    );
  };

  const emailCliente = (ordine) =>
    ordine.utente?.email ?? ordine.emailCliente ?? "—";

  const formattaData = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ordiniFiltrati =
    filtroStato === "TUTTI"
      ? ordini
      : ordini.filter((o) => o.stato === filtroStato);

  return (
    <div
      style={{
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <h1
          className="fw-bold mb-4 text-white"
          style={{ fontFamily: "'Roboto Serif', serif" }}
        >
          Gestione Ordini
        </h1>

        {errore && (
          <Alert variant="danger" onClose={() => setErrore(null)} dismissible>
            {errore}
          </Alert>
        )}
        {messaggio && (
          <Alert
            variant="success"
            onClose={() => setMessaggio(null)}
            dismissible
          >
            {messaggio}
          </Alert>
        )}

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
          </div>
        ) : (
          <>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {["TUTTI", ...STATI].map((stato) => (
                <button
                  key={stato}
                  onClick={() => setFiltroStato(stato)}
                  className="px-3 py-2 fw-semibold small border-0"
                  style={{
                    borderRadius: "10px",
                    cursor: "pointer",
                    backgroundColor:
                      filtroStato === stato
                        ? "#EED972"
                        : "rgba(255,255,255,0.06)",
                    color: filtroStato === stato ? "#221915" : "#f8f9fa",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {stato === "TUTTI" ? "Tutti" : stato.replaceAll("_", " ")}
                </button>
              ))}
            </div>

            {ordiniFiltrati.length === 0 ? (
              <p className="text-light opacity-75">
                Nessun ordine{" "}
                {filtroStato !== "TUTTI" &&
                  `con stato "${filtroStato.replaceAll("_", " ")}"`}
                .
              </p>
            ) : (
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <Table
                    responsive
                    variant="dark"
                    className="mb-0 align-middle"
                  >
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Indirizzo</th>
                        <th>Totale</th>
                        <th>Origine</th>
                        <th>Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniFiltrati.map((ordine) => (
                        <tr key={ordine.uuid}>
                          <td className="small">
                            {formattaData(ordine.dataOrdine)}
                          </td>
                          <td>{nomeCliente(ordine)}</td>
                          <td className="small">{emailCliente(ordine)}</td>
                          <td className="small">
                            {ordine.indirizzoSpedizione}
                          </td>
                          <td className="fw-bold" style={{ color: "#EED972" }}>
                            € {ordine.totale.toFixed(2)}
                          </td>
                          <td>
                            {ordine.utente ? (
                              <span
                                className="px-2 py-1 rounded-pill fw-semibold small d-inline-block"
                                style={{
                                  backgroundColor: "rgba(238,217,114,0.18)",
                                  color: "#EED972",
                                  border: "1px solid rgba(238,217,114,0.4)",
                                }}
                              >
                                Account
                              </span>
                            ) : (
                              <span
                                className="px-2 py-1 rounded-pill fw-semibold small d-inline-block"
                                style={{
                                  backgroundColor: "rgba(143,184,209,0.18)",
                                  color: "#8fb8d1",
                                  border: "1px solid rgba(143,184,209,0.4)",
                                }}
                              >
                                Ospite
                              </span>
                            )}
                          </td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={ordine.stato}
                              disabled={aggiornandoId === ordine.uuid}
                              onChange={(e) =>
                                handleStatoChange(ordine.uuid, e.target.value)
                              }
                              style={{
                                backgroundColor: `${COLORE_STATO[ordine.stato]}22`,
                                color: COLORE_STATO[ordine.stato] || "#f8f9fa",
                                border: `1px solid ${COLORE_STATO[ordine.stato]}66`,
                                fontWeight: 700,
                                borderRadius: "999px",
                                minWidth: "170px",
                              }}
                            >
                              {STATI.map((stato) => (
                                <option
                                  key={stato}
                                  value={stato}
                                  style={{ color: "#221915" }}
                                >
                                  {stato.replaceAll("_", " ")}
                                </option>
                              ))}
                            </Form.Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default AdminOrdini;
