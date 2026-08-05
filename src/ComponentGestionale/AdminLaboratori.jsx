import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f5f3ef'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='9' fill='%23705d3b' text-anchor='middle' dy='.3em'%3EN/A%3C/text%3E%3C/svg%3E";

const FORM_VUOTO = {
  nome: "",
  descrizione: "",
  procedimento: "",
  dataOra: "",
  postiTotali: "",
  prezzo: "",
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AdminLaboratori() {
  const [laboratori, setLaboratori] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);

  const [formData, setFormData] = useState(FORM_VUOTO);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Stato per la modale di eliminazione personalizzata
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [labToDelete, setLabToDelete] = useState(null);

  const caricaLaboratori = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/laboratori`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento dei laboratori");
        return res.json();
      })
      .then((data) => {
        setLaboratori(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaLaboratori(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const resetForm = () => {
    setFormData(FORM_VUOTO);
    setEditingId(null);
    setImageFile(null);
  };

  const handleEdit = (lab) => {
    setFormData({
      nome: lab.nome,
      descrizione: lab.descrizione,
      dataOra: lab.dataOra.slice(0, 16),
      postiTotali: lab.postiTotali,
      prezzo: lab.prezzo,
      procedimento: lab.procedimento || "",
    });
    setEditingId(lab.uuid);
    setImageFile(null);
    setMessaggio(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowDeleteModal = (lab) => {
    setLabToDelete(lab);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setLabToDelete(null);
  };

  const confermaEliminazione = () => {
    if (!labToDelete) return;
    fetch(`${API_URL}/laboratori/${labToDelete.uuid}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        setMessaggio(`"${labToDelete.nome}" eliminato.`);
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => {
        handleCloseDeleteModal();
      });
  };

  const caricaImmagine = (id) => {
    if (!imageFile) return Promise.resolve();
    const formDataImg = new FormData();
    formDataImg.append("file", imageFile);
    return fetch(`${API_URL}/laboratori/${id}/immagine`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formDataImg,
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          "Laboratorio salvato, ma l'immagine non è stata caricata",
        );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrore(null);
    setMessaggio(null);

    const payload = {
      nome: formData.nome,
      descrizione: formData.descrizione,
      dataOra: formData.dataOra,
      postiTotali: parseInt(formData.postiTotali, 10),
      prezzo: parseFloat(formData.prezzo),
      procedimento: formData.procedimento,
    };

    const richiesta = editingId
      ? fetch(`${API_URL}/laboratori/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        })
      : fetch(`${API_URL}/laboratori`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });

    richiesta
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante il salvataggio");
        return res.json();
      })
      .then((salvato) => caricaImmagine(salvato.uuid))
      .then(() => {
        setMessaggio(
          editingId ? "Laboratorio aggiornato." : "Laboratorio creato.",
        );
        resetForm();
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f1ea",
        color: "#2b231d",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .admin-input, .admin-input:focus {
          background-color: #ffffff !important;
          color: #2b231d !important;
          border: 1px solid #dcd6cd !important;
          border-radius: 8px !important;
          padding: 0.65rem 1rem !important;
        }
        .admin-input:focus {
          border-color: #c2a642 !important;
          box-shadow: 0 0 0 0.2rem rgba(194, 166, 66, 0.15) !important;
        }
        .admin-table thead th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: #705d3b;
          font-weight: 700;
          background-color: #ede9e1 !important;
          border-bottom: 2px solid #dcd6cd !important;
          padding-top: 14px;
          padding-bottom: 14px;
        }
        .admin-table tbody tr:hover {
          background-color: rgba(194, 166, 66, 0.04) !important;
        }
        .admin-table td {
          padding-top: 14px;
          padding-bottom: 14px;
          border-color: #eae5dc !important;
        }
      `}</style>

      {/* Navbar Gestionale */}
      <Navbar
        expand="lg"
        fixed="top"
        style={{
          backgroundColor: "#1c1411",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0.8rem 2rem",
        }}
      >
        <Container fluid>
          <Navbar.Brand
            href="/admin/prodotti"
            className="fw-bold"
            style={{
              color: "#EED972",
              fontFamily: "'Roboto Serif', serif",
              fontSize: "1.25rem",
            }}
          >
            Gestionale &middot; Matillo
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="admin-navbar-nav"
            className="border-0 bg-transparent"
          />
          <Navbar.Collapse
            id="admin-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="align-items-lg-center gap-3">
              <Nav.Link
                href="/admin/prodotti"
                className="text-light opacity-75"
              >
                Prodotti
              </Nav.Link>
              <Nav.Link href="/admin/ordini" className="text-light opacity-75">
                Ordini
              </Nav.Link>
              <Nav.Link href="/shop" className="text-light opacity-75">
                Anteprima Shop
              </Nav.Link>
              <Nav.Link
                href="/admin/laboratori"
                className="fw-semibold"
                style={{ color: "#EED972" }}
              >
                Laboratori
              </Nav.Link>
              <Button
                variant="outline-light"
                size="sm"
                href="/login"
                className="px-3 rounded-pill border-light text-light"
                style={{ backgroundColor: "transparent" }}
              >
                Esci
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container style={{ maxWidth: "1140px" }} className="mt-4">
        <div className="mb-5 d-flex justify-content-between align-items-end">
          <div>
            <h1
              className="fw-bold mb-1 display-5"
              style={{ fontFamily: "'Roboto Serif', serif", color: "#2b231d" }}
            >
              Gestione Laboratori
            </h1>
            <p className="text-muted mb-0" style={{ maxWidth: "600px" }}>
              Pannello di controllo amministrativo per la pianificazione e la
              gestione dei corsi di panificazione.
            </p>
          </div>
          <Button
            variant="outline-secondary"
            size="sm"
            href="/login"
            className="px-3 rounded-pill"
          >
            Esci
          </Button>
        </div>

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

        <div
          className="p-4 mb-5 shadow-sm"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2ded6",
            borderRadius: "16px",
          }}
        >
          <h4
            className="mb-4 fw-bold"
            style={{
              fontFamily: "'Roboto Serif', serif",
              fontSize: "1.3rem",
              color: "#2b231d",
            }}
          >
            {editingId ? "Modifica laboratorio" : "Aggiungi nuovo laboratorio"}
          </h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Nome
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="text"
                  name="nome"
                  placeholder="Es. Masterclass di Panificazione"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Posti totali
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="number"
                  min="1"
                  name="postiTotali"
                  placeholder="10"
                  value={formData.postiTotali}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Prezzo (€)
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="number"
                  step="0.01"
                  min="0"
                  name="prezzo"
                  placeholder="0.00"
                  value={formData.prezzo}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col xs={12}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Descrizione
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  rows={2}
                  name="descrizione"
                  placeholder="Inserisci una descrizione dettagliata..."
                  value={formData.descrizione}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Data e ora
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="datetime-local"
                  name="dataOra"
                  value={formData.dataOra}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col xs={12}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Procedimento (un passaggio per riga)
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  rows={4}
                  name="procedimento"
                  value={formData.procedimento}
                  onChange={handleChange}
                  placeholder={
                    "Impastare la pasta frolla\nPreparare la crema pasticcera\nAssemblare e cuocere la crostata"
                  }
                />
              </Col>

              <Col xs={12}>
                <Form.Label
                  className="small text-muted fw-bold text-uppercase"
                  style={{ fontSize: "0.75rem" }}
                >
                  Immagine {editingId && "(lascia vuoto per non modificarla)"}
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="fw-bold border-0 px-4 py-2 shadow-sm"
                style={{
                  backgroundColor: "#2b231d",
                  color: "#ffffff",
                  borderRadius: "8px",
                }}
              >
                {submitting
                  ? "Salvataggio..."
                  : editingId
                    ? "Salva modifiche"
                    : "Crea laboratorio"}
              </Button>
              {editingId && (
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                  className="fw-semibold px-4 py-2"
                  style={{ borderRadius: "8px" }}
                >
                  Annulla
                </Button>
              )}
            </div>
          </Form>
        </div>

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#705d3b" }} />
          </div>
        ) : (
          <div
            className="shadow-sm"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e2ded6",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Table
                responsive
                className="admin-table mb-0 align-middle"
                style={{ backgroundColor: "transparent" }}
              >
                <thead>
                  <tr>
                    <th className="ps-4">Foto</th>
                    <th>Nome</th>
                    <th>Data</th>
                    <th>Posti</th>
                    <th>Prezzo</th>
                    <th className="text-end pe-4">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratori.map((lab) => (
                    <tr key={lab.uuid}>
                      <td className="ps-4">
                        <img
                          src={lab.immagine || PLACEHOLDER_IMG}
                          alt={lab.nome}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #dcd6cd",
                          }}
                        />
                      </td>
                      <td className="fw-semibold text-dark">{lab.nome}</td>
                      <td className="small text-muted">
                        {new Date(lab.dataOra).toLocaleString("it-IT")}
                      </td>
                      <td className="small">
                        <span
                          className="px-2 py-1 rounded-pill fw-semibold"
                          style={{
                            backgroundColor: "#f4f1ea",
                            color: "#5c4d37",
                            border: "1px solid #e2ded6",
                          }}
                        >
                          {lab.postiDisponibili} / {lab.postiTotali} liberi
                        </span>
                      </td>
                      <td className="fw-bold" style={{ color: "#705d3b" }}>
                        € {lab.prezzo.toFixed(2)}
                      </td>
                      <td
                        className="text-end pe-4"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="me-2 px-3 fw-semibold border-0"
                          style={{
                            backgroundColor: "#f4f1ea",
                            color: "#2b231d",
                            borderRadius: "6px",
                          }}
                          onClick={() => handleEdit(lab)}
                        >
                          Modifica
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="px-3 fw-semibold border-0"
                          style={{
                            backgroundColor: "#fdf2f2",
                            color: "#b53737",
                            borderRadius: "6px",
                          }}
                          onClick={() => handleShowDeleteModal(lab)}
                        >
                          Elimina
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {laboratori.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Nessun laboratorio registrato.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2ded6",
          }}
        >
          <Modal.Title className="fw-bold fs-5" style={{ color: "#2b231d" }}>
            Conferma eliminazione
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#ffffff",
            color: "#2b231d",
            padding: "1.5rem",
          }}
        >
          Sei sicuro di voler eliminare il laboratorio{" "}
          <strong style={{ color: "#705d3b" }}>{labToDelete?.nome}</strong>?
          L'azione non potrà essere annullata.
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#f9f8f6", borderTop: "1px solid #e2ded6" }}
        >
          <Button
            variant="outline-secondary"
            onClick={handleCloseDeleteModal}
            className="px-4 rounded-pill"
            style={{ fontWeight: 500 }}
          >
            Annulla
          </Button>
          <Button
            variant="danger"
            onClick={confermaEliminazione}
            className="px-4 rounded-pill border-0"
            style={{ backgroundColor: "#b53737", fontWeight: 600 }}
          >
            Elimina
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AdminLaboratori;
