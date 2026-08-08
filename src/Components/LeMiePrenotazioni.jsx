import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import sfondoOrdini from "../assets/20210118_MAT_Presentazione concept_page-0011.jpg";

const API_URL = "http://localhost:3001/api";

const COLORE_STATO = {
  CONFERMATA: "#8fd19e",
  CANCELLATA: "#e08585",
};

function LeMiePrenotazioni() {
  const navigate = useNavigate();

  const [utenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  const [prenotazioni, setPrenotazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    if (!utenteLoggato) return;

    setCaricamento(true);
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    fetch(`${API_URL}/prenotazioni/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore nel caricamento delle prenotazioni");
        return res.json();
      })
      .then((data) => {
        const ordinate = [...data].sort(
          (a, b) => new Date(b.dataPrenotazione) - new Date(a.dataPrenotazione),
        );
        setPrenotazioni(ordinate);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, [utenteLoggato]);

  const formattaData = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        background: `linear-gradient(90deg, transparent 0%, transparent 55%, rgba(44,34,30,0.5) 75%, rgba(44,34,30,0.75) 100%), linear-gradient(160deg, rgba(58,43,35,0.55) 0%, rgba(44,34,30,0.65) 100%), url(${sfondoOrdini}) center center / cover no-repeat`,
        color: "#EFECE6",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
    >
      <Container style={{ maxWidth: "850px" }}>
        {/* Tasto Freccia per tornare indietro */}
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => navigate(-1)}
          className="d-inline-flex align-items-center gap-2 mb-4 rounded-pill px-3 py-2 border-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            color: "#D4C37E",
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>←</span>{" "}
          <strong>Indietro</strong>
        </Button>

        <div className="mb-4 text-start">
          <span
            className="text-uppercase fw-semibold"
            style={{
              color: "#D4C37E",
              fontSize: "11px",
              letterSpacing: "2.5px",
            }}
          >
            Laboratori Matillo
          </span>
          <h1
            className="fw-bold text-white mt-1 display-5"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Le Mie Prenotazioni
          </h1>
        </div>

        {!utenteLoggato ? (
          <div
            className="p-5 text-center mx-auto"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              maxWidth: "440px",
            }}
          >
            <p className="text-light opacity-75 mb-4">
              Accedi per consultare le tue prenotazioni ai laboratori.
            </p>
            <Button
              onClick={() => navigate("/accedi")}
              className="w-100 fw-bold border-0 py-3"
              style={{
                backgroundColor: "#D4C37E",
                color: "#1D1512",
                borderRadius: "10px",
              }}
            >
              Accedi o Registrati
            </Button>
          </div>
        ) : (
          <>
            {errore && <Alert variant="danger">{errore}</Alert>}

            {caricamento ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: "#D4C37E" }} />
              </div>
            ) : prenotazioni.length === 0 ? (
              <p className="text-light opacity-75">
                Non hai ancora prenotato nessun laboratorio.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {prenotazioni.map((p) => (
                  <Card
                    key={p.uuid}
                    className="border-0 text-white"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.028)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "16px",
                    }}
                  >
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5
                          className="fw-bold text-white mb-0"
                          style={{ fontFamily: "'Roboto Serif', serif" }}
                        >
                          {p.laboratorio.nome}
                        </h5>
                        <span
                          className="px-3 py-1 rounded-pill small fw-semibold"
                          style={{
                            backgroundColor: `${COLORE_STATO[p.stato] || "#D4C37E"}15`,
                            color: COLORE_STATO[p.stato] || "#D4C37E",
                            border: `1px solid ${COLORE_STATO[p.stato] || "#D4C37E"}35`,
                            fontSize: "11px",
                          }}
                        >
                          {p.stato}
                        </span>
                      </div>
                      <p className="text-light opacity-75 small mb-3">
                        {formattaData(p.laboratorio.dataOra)}
                      </p>
                      <div
                        className="d-flex justify-content-between align-items-center pt-3"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span className="text-light opacity-90 small">
                          {p.numeroPersone}{" "}
                          {p.numeroPersone === 1 ? "persona" : "persone"}
                        </span>
                        <span
                          className="fw-bold fs-5"
                          style={{
                            color: "#D4C37E",
                            fontFamily: "'Roboto Serif', serif",
                          }}
                        >
                          €{" "}
                          {(p.laboratorio.prezzo * p.numeroPersone).toFixed(2)}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default LeMiePrenotazioni;
