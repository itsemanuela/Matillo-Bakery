import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function AdminPrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [laboratori, setLaboratori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stati per i filtri
  const [laboratorioFiltro, setLaboratorioFiltro] = useState("");
  const [statoFiltro, setStatoFiltro] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPrenotazioneUuid, setSelectedPrenotazioneUuid] =
    useState(null);

  // 1. Carica la lista dei laboratori per popolare il menu a tendina del filtro
  useEffect(() => {
    fetch("http://localhost:3001/api/laboratori", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setLaboratori(data))
      .catch((err) => console.error("Errore caricamento laboratori:", err));
  }, []);

  // 2. Funzione per recuperare le prenotazioni applicando i filtri scelti
  const fetchPrenotazioni = () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (laboratorioFiltro) params.append("laboratorioId", laboratorioFiltro);
    if (statoFiltro) params.append("stato", statoFiltro);

    fetch(`http://localhost:3001/api/prenotazioni?${params.toString()}`, {
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
  };

  // Ricarica automaticamente ogni volta che cambia uno dei due filtri
  useEffect(() => {
    fetchPrenotazioni();
  }, [laboratorioFiltro, statoFiltro]);

  const handleOpenModal = (uuid) => {
    setSelectedPrenotazioneUuid(uuid);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPrenotazioneUuid(null);
    setShowModal(false);
  };

  const handleConfirmCancel = () => {
    if (!selectedPrenotazioneUuid) return;

    fetch(
      `http://localhost:3001/api/prenotazioni/${selectedPrenotazioneUuid}/cancella`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Errore durante la cancellazione");
        }
        return res.text();
      })
      .then(() => {
        handleCloseModal();
        fetchPrenotazioni();
      })
      .catch((err) => {
        console.error("Errore cancellazione:", err);
        handleCloseModal();
        alert("Impossibile completare l'operazione: " + err.message);
      });
  };

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Errore: {error}</Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fcf8f5",
        minHeight: "88vh",
        paddingBottom: "3rem",
      }}
    >
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2
            style={{
              fontFamily: "'Roboto Serif', serif",
              color: "#1c1613",
              fontWeight: 700,
            }}
          >
            Gestione Prenotazioni Laboratori
          </h2>
          <Badge
            bg="secondary"
            className="px-3 py-2 fs-6"
            style={{ backgroundColor: "#1c1613" }}
          >
            Totale: {prenotazioni.length}
          </Badge>
        </div>

        {/* SEZIONE FILTRI */}
        <div
          className="p-4 rounded-4 mb-4 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(28, 22, 19, 0.1)",
          }}
        >
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold text-muted">
                  Filtra per Laboratorio
                </Form.Label>
                <Form.Select
                  value={laboratorioFiltro}
                  onChange={(e) => setLaboratorioFiltro(e.target.value)}
                  style={{ borderRadius: "10px" }}
                >
                  <option value="">Tutti i laboratori</option>
                  {laboratori.map((lab) => {
                    const labId = lab.uuid || lab.id;
                    return (
                      <option key={labId} value={labId}>
                        {lab.nome}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold text-muted">
                  Filtra per Stato
                </Form.Label>
                <Form.Select
                  value={statoFiltro}
                  onChange={(e) => setStatoFiltro(e.target.value)}
                  style={{ borderRadius: "10px" }}
                >
                  <option value="">Tutti gli stati</option>
                  <option value="CONFERMATA">Confermate / Attive</option>
                  <option value="CANCELLATA">Cancellate</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {loading ? (
          <Container className="text-center my-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
            <p className="mt-2 text-muted">
              Caricamento prenotazioni in corso...
            </p>
          </Container>
        ) : prenotazioni.length === 0 ? (
          <Alert variant="info" className="text-center py-4">
            Nessuna prenotazione trovata con i filtri selezionati.
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {prenotazioni.map((p, index) => {
              const isCancellata = p.stato === "CANCELLATA";
              return (
                <Col key={p.uuid || index}>
                  <Card
                    className="h-100 shadow-sm border-0"
                    style={{
                      borderRadius: "16px",
                      backgroundColor: isCancellata ? "#f8f9fa" : "#ffffff",
                      opacity: isCancellata ? 0.75 : 1,
                      borderLeft: isCancellata
                        ? "5px solid #dc3545"
                        : "5px solid #EED972",
                    }}
                  >
                    <Card.Body className="d-flex flex-column justify-content-between p-4">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="text-muted small text-uppercase tracking-wider">
                            Laboratorio
                          </span>
                          <Badge bg={isCancellata ? "danger" : "success"}>
                            {p.stato}
                          </Badge>
                        </div>
                        <h5
                          className="fw-bold mb-3"
                          style={{
                            color: "#1c1613",
                            fontFamily: "'Roboto Serif', serif",
                          }}
                        >
                          {p.laboratorio
                            ? p.laboratorio.nome
                            : "Laboratorio non disponibile"}
                        </h5>
                        <hr className="text-muted opacity-25" />
                        <div className="mb-2">
                          <strong>Cliente:</strong> {p.nomeCliente}{" "}
                          {p.cognomeCliente}
                        </div>
                        <div className="mb-2 text-muted small">
                          <strong>Email:</strong> {p.emailCliente}
                        </div>
                        <div className="mb-2 text-muted small">
                          <strong>Telefono:</strong> {p.telefonoCliente}
                        </div>
                        <div className="mb-3">
                          <Badge
                            bg="light"
                            text="dark"
                            className="border px-2 py-1 d-inline-flex align-items-center"
                          >
                            <span
                              className="me-1"
                              style={{ fontSize: "0.9rem" }}
                            >
                              👥
                            </span>
                            {p.numeroPersone}{" "}
                            {p.numeroPersone === 1 ? "persona" : "persone"}
                          </Badge>
                        </div>
                      </div>

                      {!isCancellata && (
                        <div className="mt-3 pt-2 border-top text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="w-100 rounded-pill"
                            onClick={() => handleOpenModal(p.uuid)}
                          >
                            Annulla Prenotazione
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1c1613", color: "#fff" }}
          >
            <Modal.Title
              style={{ fontFamily: "'Roboto Serif', serif", color: "#EED972" }}
            >
              Conferma Annullamento
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <p className="mb-0 text-secondary">
              Sei sicura di voler cancellare questa prenotazione? L'operazione
              rimetterà i posti a disposizione.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              className="rounded-pill px-4"
            >
              Chiudi
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmCancel}
              className="rounded-pill px-4"
            >
              Conferma Annullamento
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default AdminPrenotazioni;
