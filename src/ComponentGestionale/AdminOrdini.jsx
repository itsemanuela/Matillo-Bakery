import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

const STATI = [
  "IN_ELABORAZIONE",
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "CANCELLATO",
];

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AdminOrdini() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    navigate("/login");
  };

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
        backgroundColor: "#f4f0eb",
        backgroundImage:
          "radial-gradient(circle at 50% 0%, #faf7f2 0%, #efe7de 70%)",
        color: "#2c221e",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(184, 153, 122, 0.25);
          box-shadow: 0 16px 40px rgba(110, 85, 60, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          border-radius: 20px;
        }

        .admin-table thead th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: #7d5e1d;
          font-weight: 700;
          border-bottom: 2px solid rgba(184, 153, 122, 0.3) !important;
          padding-top: 16px;
          padding-bottom: 16px;
          background: transparent !important;
        }

        .admin-table tbody tr {
          transition: background-color 0.2s ease;
        }

        .admin-table tbody tr:hover {
          background-color: rgba(194, 155, 70, 0.06) !important;
        }

        .admin-table td {
          padding-top: 16px;
          padding-bottom: 16px;
          border-color: rgba(184, 153, 122, 0.15) !important;
          color: #2c221e;
        }

        /* Stili dinamici personalizzati per i select dello stato */
        .select-stato-IN_ELABORAZIONE {
          background-color: rgba(156, 118, 37, 0.15) !important;
          color: #9c7625 !important;
          border: 1px solid rgba(156, 118, 37, 0.4) !important;
        }
        .select-stato-PAGATO {
          background-color: rgba(43, 122, 103, 0.15) !important;
          color: #2b7a67 !important;
          border: 1px solid rgba(43, 122, 103, 0.4) !important;
        }
        .select-stato-IN_PREPARAZIONE {
          background-color: rgba(43, 94, 122, 0.15) !important;
          color: #2b5e7a !important;
          border: 1px solid rgba(43, 94, 122, 0.4) !important;
        }
        .select-stato-SPEDITO {
          background-color: rgba(122, 43, 122, 0.15) !important;
          color: #7a2b7a !important;
          border: 1px solid rgba(122, 43, 122, 0.4) !important;
        }
        .select-stato-CONSEGNATO {
          background-color: rgba(33, 136, 56, 0.15) !important;
          color: #218838 !important;
          border: 1px solid rgba(33, 136, 56, 0.4) !important;
        }
        .select-stato-CANCELLATO {
          background-color: rgba(189, 33, 48, 0.15) !important;
          color: #bd2130 !important;
          border: 1px solid rgba(189, 33, 48, 0.4) !important;
        }
      `}</style>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                fontFamily: "'Roboto Serif', serif",
                letterSpacing: "-0.5px",
                color: "#2c221e",
              }}
            >
              Gestione Ordini
            </h1>
            <p className="text-secondary small mb-0">
              Monitora e gestisci gli ordini effettuati dai clienti
            </p>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/admin/prodotti")}
              style={{ borderRadius: "10px", padding: "6px 14px" }}
            >
              Prodotti
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={handleLogout}
              style={{
                borderRadius: "10px",
                borderColor: "rgba(44,34,30,0.2)",
                padding: "6px 16px",
                color: "#2c221e",
              }}
            >
              Esci
            </Button>
          </div>
        </div>

        {errore && (
          <Alert
            variant="danger"
            onClose={() => setErrore(null)}
            dismissible
            className="border-0 shadow-sm"
          >
            {errore}
          </Alert>
        )}
        {messaggio && (
          <Alert
            variant="success"
            onClose={() => setMessaggio(null)}
            dismissible
            className="border-0 shadow-sm"
          >
            {messaggio}
          </Alert>
        )}

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#c29b46" }} />
          </div>
        ) : (
          <>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {["TUTTI", ...STATI].map((stato) => {
                const attivo = filtroStato === stato;
                return (
                  <button
                    key={stato}
                    onClick={() => setFiltroStato(stato)}
                    className="px-3 py-2 fw-semibold small"
                    style={{
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: attivo
                        ? "#c29b46"
                        : "rgba(255, 255, 255, 0.7)",
                      color: attivo ? "#ffffff" : "#4a3b32",
                      border: attivo
                        ? "none"
                        : "1px solid rgba(184, 153, 122, 0.3)",
                      boxShadow: attivo
                        ? "0 4px 12px rgba(194, 155, 70, 0.3)"
                        : "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {stato === "TUTTI" ? "Tutti" : stato.replaceAll("_", " ")}
                  </button>
                );
              })}
            </div>

            {ordiniFiltrati.length === 0 ? (
              <div className="glass-card text-center p-5 text-secondary">
                Nessun ordine{" "}
                {filtroStato !== "TUTTI" &&
                  `con stato "${filtroStato.replaceAll("_", " ")}"`}
                .
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div style={{ overflowX: "auto" }}>
                  <Table responsive className="admin-table mb-0 align-middle">
                    <thead>
                      <tr>
                        <th className="ps-4">Data</th>
                        <th>Cliente</th>
                        <th>Email</th>
                        <th>Indirizzo</th>
                        <th>Totale</th>
                        <th>Origine</th>
                        <th className="text-end pe-4">Stato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordiniFiltrati.map((ordine) => (
                        <tr key={ordine.uuid}>
                          <td className="ps-4 small text-secondary">
                            {formattaData(ordine.dataOrdine)}
                          </td>
                          <td className="fw-semibold text-dark">
                            {nomeCliente(ordine)}
                          </td>
                          <td className="small text-secondary">
                            {emailCliente(ordine)}
                          </td>
                          <td className="small">
                            {ordine.indirizzoSpedizione}
                          </td>
                          <td className="fw-bold" style={{ color: "#9c7625" }}>
                            € {ordine.totale.toFixed(2)}
                          </td>
                          <td>
                            {ordine.utente ? (
                              <span
                                className="px-2.5 py-1 rounded-pill fw-semibold small d-inline-block"
                                style={{
                                  backgroundColor: "rgba(194,155,70,0.18)",
                                  color: "#8a6616",
                                  border: "1px solid rgba(194,155,70,0.35)",
                                }}
                              >
                                Account
                              </span>
                            ) : (
                              <span
                                className="px-2.5 py-1 rounded-pill fw-semibold small d-inline-block"
                                style={{
                                  backgroundColor: "rgba(43,94,122,0.12)",
                                  color: "#2b5e7a",
                                  border: "1px solid rgba(43,94,122,0.25)",
                                }}
                              >
                                Ospite
                              </span>
                            )}
                          </td>
                          <td className="text-end pe-4">
                            <Form.Select
                              size="sm"
                              value={ordine.stato}
                              disabled={aggiornandoId === ordine.uuid}
                              onChange={(e) =>
                                handleStatoChange(ordine.uuid, e.target.value)
                              }
                              className={`select-stato-${ordine.stato}`}
                              style={{
                                display: "inline-block",
                                fontWeight: 700,
                                borderRadius: "999px",
                                minWidth: "170px",
                                width: "auto",
                              }}
                            >
                              {STATI.map((stato) => (
                                <option
                                  key={stato}
                                  value={stato}
                                  style={{
                                    color: "#2c221e",
                                    backgroundColor: "#ffffff",
                                  }}
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
