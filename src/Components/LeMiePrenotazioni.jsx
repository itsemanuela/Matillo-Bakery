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

function LeMiePrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stati per il modale di Annullamento
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState(null);

  // Stati per il modale di Modifica
  const [showEditModal, setShowEditModal] = useState(false);
  const [formDataEdit, setFormDataEdit] = useState({
    numeroPersone: 1,
    note: "",
  });
  const [errorEdit, setErrorEdit] = useState(null);

  const fetchMiePrenotazioni = () => {
    setLoading(true);
    fetch("http://localhost:3001/api/prenotazioni/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore nel recupero delle tue prenotazioni");
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

  useEffect(() => {
    fetchMiePrenotazioni();
  }, []);

  // Gestione Modale Annullamento
  const handleOpenCancelModal = (uuid) => {
    setSelectedUuid(uuid);
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setSelectedUuid(null);
    setShowCancelModal(false);
  };

  const handleConfirmCancel = () => {
    if (!selectedUuid) return;

    fetch(`http://localhost:3001/api/prenotazioni/${selectedUuid}/cancella`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Errore durante l'annullamento");
        }
        return res.text();
      })
      .then(() => {
        handleCloseCancelModal();
        fetchMiePrenotazioni();
      })
      .catch((err) => {
        alert("Impossibile completare l'operazione: " + err.message);
        handleCloseCancelModal();
      });
  };

  // Gestione Modale Modifica
  const handleOpenEditModal = (p) => {
    setSelectedUuid(p.uuid);
    setFormDataEdit({
      numeroPersone: p.numeroPersone || 1,
      note: p.note || "",
    });
    setErrorEdit(null);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUuid(null);
    setErrorEdit(null);
    setShowEditModal(false);
  };

  const handleEditChange = (e) => {
    setFormDataEdit({ ...formDataEdit, [e.target.name]: e.target.value });
  };

  const handleConfirmEdit = (e) => {
    e.preventDefault();
    if (!selectedUuid) return;
    setErrorEdit(null);

    fetch(`http://localhost:3001/api/prenotazioni/${selectedUuid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formDataEdit),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errText = await res.text();
          try {
            const parsed = JSON.parse(errText);
            throw new Error(parsed.message || "Errore durante la modifica");
          } catch {
            throw new Error(errText || "Errore durante la modifica");
          }
        }
        return res.json();
      })
      .then(() => {
        handleCloseEditModal();
        fetchMiePrenotazioni();
      })
      .catch((err) => {
        setErrorEdit(err.message);
      });
  };

  if (loading) {
    return (
      <Container className="text-center my-5" style={{ paddingTop: "120px" }}>
        <Spinner animation="border" style={{ color: "#EED972" }} />
        <p className="mt-2 text-muted">Caricamento delle tue prenotazioni...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5" style={{ paddingTop: "120px" }}>
        <Alert variant="danger">Errore: {error}</Alert>
      </Container>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fcf8f5",
        minHeight: "88vh",
        paddingTop: "120px", // <-- Spaziatura per evitare la sovrapposizione con la navbar
        paddingBottom: "3rem",
      }}
    >
      <Container className="py-4">
        <h2
          className="mb-4"
          style={{
            fontFamily: "'Roboto Serif', serif",
            color: "#1c1613",
            fontWeight: 700,
          }}
        >
          Le Mie Prenotazioni ai Laboratori
        </h2>

        {prenotazioni.length === 0 ? (
          <Alert variant="info" className="text-center py-4">
            Non hai ancora effettuato alcuna prenotazione per i laboratori.
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
                          <span className="text-muted small text-uppercase">
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
                          {p.laboratorio ? p.laboratorio.nome : "Laboratorio"}
                        </h5>
                        <hr className="text-muted opacity-25" />
                        <div className="mb-3">
                          <Badge
                            bg="light"
                            text="dark"
                            className="border px-2 py-1"
                          >
                            👥 {p.numeroPersone}{" "}
                            {p.numeroPersone === 1 ? "persona" : "persone"}
                          </Badge>
                        </div>
                      </div>

                      {!isCancellata && (
                        <div className="mt-3 pt-2 border-top d-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="w-50 rounded-pill"
                            onClick={() => handleOpenEditModal(p)}
                          >
                            Modifica
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="w-50 rounded-pill"
                            onClick={() => handleOpenCancelModal(p.uuid)}
                          >
                            Annulla
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

        {/* MODALE DI CONFERMA ANNULLAMENTO */}
        <Modal show={showCancelModal} onHide={handleCloseCancelModal} centered>
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
              Sei sicura di voler cancellare questa prenotazione? I posti
              torneranno disponibili.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseCancelModal}
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

        {/* MODALE DI MODIFICA PRENOTAZIONE */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#1c1613", color: "#fff" }}
          >
            <Modal.Title
              style={{ fontFamily: "'Roboto Serif', serif", color: "#EED972" }}
            >
              Modifica Prenotazione
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleConfirmEdit}>
            <Modal.Body className="py-4">
              {errorEdit && (
                <Alert variant="danger" className="py-2 small">
                  {errorEdit}
                </Alert>
              )}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-secondary">
                  Numero Persone
                </Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  name="numeroPersone"
                  value={formDataEdit.numeroPersone}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-secondary">
                  Note (opzionale)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="note"
                  value={formDataEdit.note}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseEditModal}
                className="rounded-pill px-4"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                variant="dark"
                className="rounded-pill px-4"
                style={{ backgroundColor: "#1c1613", color: "#EED972" }}
              >
                Salva Modifiche
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default LeMiePrenotazioni;
