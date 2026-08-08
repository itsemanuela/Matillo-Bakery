import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

const API_URL = "http://localhost:3001/api";

function MyOrdini() {
  const navigate = useNavigate();
  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [idEliminazioneInCorso, setIdEliminazioneInCorso] = useState(null);
  const [messaggioFeedback, setMessaggioFeedback] = useState(null);

  // Stati per la gestione della modale di conferma
  const [mostraModale, setMostraModale] = useState(false);
  const [ordineSelezionatoDaEliminare, setOrdineSelezionatoDaEliminare] =
    useState(null);

  const fetchOrdini = () => {
    setCaricamento(true);
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/ordini/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Impossibile recuperare i tuoi ordini.");
        return res.json();
      })
      .then((data) => {
        setOrdini(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    fetchOrdini();
  }, []);

  // Apre la modale di conferma salvando l'id dell'ordine
  const apriConfermaEliminazione = (id) => {
    setOrdineSelezionatoDaEliminare(id);
    setMostraModale(true);
  };

  // Chiude la modale
  const chiudiModale = () => {
    setMostraModale(false);
    setOrdineSelezionatoDaEliminare(null);
  };

  // Esegue l'effettiva eliminazione tramite DELETE /api/ordini/{id} dopo la conferma
  const confermaEliminazione = () => {
    if (!ordineSelezionatoDaEliminare) return;

    const token = localStorage.getItem("token");
    const id = ordineSelezionatoDaEliminare;

    setIdEliminazioneInCorso(id);
    setMessaggioFeedback(null);
    chiudiModale();

    fetch(`${API_URL}/ordini/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante l'eliminazione dell'ordine.");

        setOrdini((prevOrdini) =>
          prevOrdini.filter((ordine) => ordine.uuid !== id && ordine.id !== id),
        );
        setMessaggioFeedback({
          tipo: "success",
          testo: "Ordine eliminato con successo.",
        });
      })
      .catch((err) => {
        setMessaggioFeedback({ tipo: "danger", testo: err.message });
      })
      .finally(() => {
        setIdEliminazioneInCorso(null);
      });
  };

  const formattaData = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (caricamento) {
    return (
      <div
        style={{
          backgroundColor: "#221915",
          minHeight: "100vh",
          paddingTop: "160px",
        }}
        className="text-center"
      >
        <Spinner animation="border" style={{ color: "#EED972" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          "linear-gradient(160deg, #9c6b52 0%, #834F41 40%, #6d4838 75%, #573b2e 100%)",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "100px",
      }}
    >
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1
            className="fw-bold display-5"
            style={{ fontFamily: "'Roboto Serif', serif", color: "#EED972" }}
          >
            I tuoi Ordini
          </h1>
          <Button variant="outline-light" onClick={() => navigate("/shop")}>
            Vai allo Shop
          </Button>
        </div>

        {errore && <Alert variant="danger">{errore}</Alert>}
        {messaggioFeedback && (
          <Alert variant={messaggioFeedback.tipo}>
            {messaggioFeedback.testo}
          </Alert>
        )}

        {ordini.length === 0 ? (
          <div
            className="text-center py-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "20px",
            }}
          >
            <p className="text-light opacity-75 fs-5 mb-3">
              Non hai ancora effettuato alcun ordine.
            </p>
            <Button
              onClick={() => navigate("/shop")}
              style={{
                backgroundColor: "#EED972",
                color: "#221915",
                border: "none",
              }}
              className="fw-bold px-4 py-2"
            >
              Inizia gli acquisti
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {ordini.map((ordine) => {
              const ordineId = ordine.uuid || ordine.id;
              return (
                <Col md={6} lg={4} key={ordineId}>
                  <Card
                    className="h-100 border-0 shadow-lg"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(15px)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      color: "#f8f9fa",
                    }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-between p-4">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: "#EED972",
                              color: "#221915",
                            }}
                          >
                            {ordine.stato || "IN_ATTESA"}
                          </span>
                          <span className="text-light opacity-60 small">
                            ID: {ordineId.substring(0, 8)}...
                          </span>
                        </div>

                        <Card.Title
                          className="fw-bold mb-3"
                          style={{ fontFamily: "'Roboto Serif', serif" }}
                        >
                          Totale: € {ordine.totale?.toFixed(2)}
                        </Card.Title>

                        <p className="text-light opacity-90 small mb-2">
                          <i
                            className="bi bi-geo-alt me-2"
                            style={{ color: "#EED972" }}
                          ></i>
                          Spedizione: {ordine.indirizzoSpedizione}
                        </p>

                        <div className="mb-3">
                          <span
                            className="d-block text-uppercase small text-warning mb-1"
                            style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
                          >
                            Prodotti:
                          </span>
                          <ul className="ps-3 mb-0 small opacity-90">
                            {ordine.dettagli?.map((dettaglio, idx) => (
                              <li key={idx}>
                                {dettaglio.quantita}x{" "}
                                {dettaglio.prodotto?.nome || "Prodotto"} (€{" "}
                                {dettaglio.prezzoUnitario?.toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={idEliminazioneInCorso === ordineId}
                        onClick={() => apriConfermaEliminazione(ordineId)}
                        className="w-100 fw-bold py-2 mt-3"
                        style={{
                          borderRadius: "10px",
                          borderColor: "#e08585",
                          color: "#e08585",
                        }}
                      >
                        {idEliminazioneInCorso === ordineId
                          ? "Eliminazione..."
                          : "Elimina Ordine"}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* Modale di Conferma Eliminazione */}
      <Modal show={mostraModale} onHide={chiudiModale} centered>
        <div
          style={{
            backgroundColor: "#2b1e18",
            color: "#f8f9fa",
            border: "1px solid rgba(237, 217, 114, 0.3)",
            borderRadius: "16px",
          }}
        >
          <Modal.Header
            closeButton
            closeVariant="white"
            style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <Modal.Title
              style={{ fontFamily: "'Roboto Serif', serif", color: "#EED972" }}
            >
              Conferma Eliminazione
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <p className="mb-0 fs-6">
              Sei sicuro di voler eliminare questo ordine? L'operazione è
              irreversibile.
            </p>
          </Modal.Body>
          <Modal.Footer
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <Button
              variant="secondary"
              onClick={chiudiModale}
              style={{ borderRadius: "8px" }}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              onClick={confermaEliminazione}
              style={{
                borderRadius: "8px",
                backgroundColor: "#c0392b",
                border: "none",
              }}
            >
              Elimina definitivamente
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}

export default MyOrdini;
