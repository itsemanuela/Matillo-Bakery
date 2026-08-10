import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f1f3f5'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='9' fill='%23868e96' text-anchor='middle' dy='.3em'%3EN/A%3C/text%3E%3C/svg%3E";

const FORM_VUOTO = {
  nome: "",
  descrizione: "",
  prezzoPersona: "",
  numeroMinimoPersone: "",
  incluso: "",
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AdminCatering() {
  const [pacchetti, setPacchetti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);

  const [formData, setFormData] = useState(FORM_VUOTO);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [galleriaFiles, setGalleriaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [daEliminare, setDaEliminare] = useState(null);

  const caricaPacchetti = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/catering`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento dei pacchetti");
        return res.json();
      })
      .then((data) => {
        setPacchetti(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaPacchetti(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(FORM_VUOTO);
    setEditingId(null);
    setImageFile(null);
    setGalleriaFiles([]);
  };

  const handleEdit = (p) => {
    setFormData({
      nome: p.nome,
      descrizione: p.descrizione,
      prezzoPersona: p.prezzoPersona,
      numeroMinimoPersone: p.numeroMinimoPersone,
      incluso: p.incluso || "",
    });
    setEditingId(p.uuid);
    setImageFile(null);
    setGalleriaFiles([]);
    setMessaggio(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confermaEliminazione = () => {
    if (!daEliminare) return;
    fetch(`${API_URL}/catering/${daEliminare.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        setMessaggio(`"${daEliminare.nome}" eliminato con successo.`);
        caricaPacchetti(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setDaEliminare(null));
  };

  const caricaImmagine = (id) => {
    if (!imageFile) return Promise.resolve();
    const fd = new FormData();
    fd.append("file", imageFile);
    return fetch(`${API_URL}/catering/${id}/immagine`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: fd,
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          "Pacchetto salvato, ma l'immagine di copertina non è stata caricata",
        );
    });
  };

  const caricaGalleria = (id) => {
    if (galleriaFiles.length === 0) return Promise.resolve();
    const fd = new FormData();
    galleriaFiles.forEach((f) => fd.append("files", f));
    return fetch(`${API_URL}/catering/${id}/galleria`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: fd,
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          "Pacchetto salvato, ma la galleria foto non è stata caricata",
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
      prezzoPersona: parseFloat(formData.prezzoPersona),
      numeroMinimoPersone: parseInt(formData.numeroMinimoPersone, 10),
      incluso: formData.incluso,
    };

    const richiesta = editingId
      ? fetch(`${API_URL}/catering/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        })
      : fetch(`${API_URL}/catering`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });

    richiesta
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante il salvataggio del pacchetto");
        return res.json();
      })
      .then((salvato) => caricaImmagine(salvato.uuid).then(() => salvato))
      .then((salvato) => caricaGalleria(salvato.uuid))
      .then(() => {
        setMessaggio(
          editingId
            ? "Pacchetto aggiornato con successo."
            : "Nuovo pacchetto creato con successo.",
        );
        resetForm();
        caricaPacchetti(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        color: "#212529",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .admin-input, .admin-input:focus {
          background-color: #ffffff !important;
          color: #212529 !important;
          border: 1px solid #ced4da !important;
          border-radius: 12px !important;
          padding: 0.65rem 1rem !important;
        }
        .admin-input:focus {
          border-color: #a46c52 !important;
          box-shadow: 0 0 0 0.2rem rgba(164, 108, 82, 0.15) !important;
        }
        .admin-table {
          margin-bottom: 0 !important;
          background-color: #ffffff !important;
        }
        .admin-table thead th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: #495057;
          font-weight: 700;
          background-color: #ffffff !important;
          border-bottom: 2px solid #dee2e6 !important;
          border-top: none !important;
          padding: 1rem 0.75rem !important;
        }
        .admin-table tbody td {
          padding: 1rem 0.75rem !important;
          border-color: #f1f3f5 !important;
        }
        .admin-table tbody tr:hover {
          background-color: rgba(164, 108, 82, 0.04) !important;
        }
      `}</style>

      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1
            className="fw-bold mb-0 text-dark"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Gestione Catering
          </h1>
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

        {/* Form di inserimento / modifica */}
        <div
          className="p-4 p-md-5 mb-5 bg-white shadow-sm"
          style={{
            border: "1px solid #e9ecef",
            borderRadius: "20px",
          }}
        >
          <h4
            className="text-dark fw-bold mb-4"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            {editingId ? "Modifica Pacchetto" : "Crea Nuovo Pacchetto Catering"}
          </h4>

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="text-secondary small fw-semibold">
                  Nome Pacchetto
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Es. Buffet di Feste"
                />
              </Col>
              <Col md={3}>
                <Form.Label className="text-secondary small fw-semibold">
                  Prezzo a Persona (€)
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="number"
                  step="0.01"
                  min="0"
                  name="prezzoPersona"
                  value={formData.prezzoPersona}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </Col>
              <Col md={3}>
                <Form.Label className="text-secondary small fw-semibold">
                  Persone Minime
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="number"
                  min="1"
                  name="numeroMinimoPersone"
                  value={formData.numeroMinimoPersone}
                  onChange={handleChange}
                  required
                  placeholder="Es. 10"
                />
              </Col>

              <Col xs={12}>
                <Form.Label className="text-secondary small fw-semibold">
                  Descrizione
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  rows={3}
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                  required
                  placeholder="Breve descrizione del pacchetto..."
                />
              </Col>

              <Col xs={12}>
                <Form.Label className="text-secondary small fw-semibold">
                  Cosa è incluso (un elemento per riga)
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  rows={4}
                  name="incluso"
                  value={formData.incluso}
                  onChange={handleChange}
                  placeholder={
                    "Buffet completo con servizio\nAllestimento tavoli\nPersonale di sala"
                  }
                />
              </Col>

              <Col md={6}>
                <Form.Label className="text-secondary small fw-semibold">
                  Immagine Principale{" "}
                  {editingId && "(lascia vuoto per non modificare)"}
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                />
              </Col>

              <Col md={6}>
                <Form.Label className="text-secondary small fw-semibold">
                  Galleria Foto (selezione multipla)
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setGalleriaFiles(Array.from(e.target.files))}
                />
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border-0 fw-bold shadow-sm"
                style={{
                  backgroundColor: "#a46c52",
                  color: "#ffffff",
                  borderRadius: "12px",
                }}
              >
                {submitting
                  ? "Salvataggio..."
                  : editingId
                    ? "Salva Modifiche"
                    : "Crea Pacchetto"}
              </Button>
              {editingId && (
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                  className="px-4 py-2 fw-semibold"
                  style={{ borderRadius: "12px" }}
                >
                  Annulla
                </Button>
              )}
            </div>
          </Form>
        </div>

        {/* Tabella elenco pacchetti */}
        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#a46c52" }} />
            <p className="text-muted mt-2 small">
              Caricamento pacchetti in corso...
            </p>
          </div>
        ) : (
          <div
            className="bg-white shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Table responsive hover className="admin-table align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Foto</th>
                    <th>Nome</th>
                    <th>Prezzo/pers.</th>
                    <th>Min. Persone</th>
                    <th className="text-end pe-4">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {pacchetti.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        Nessun pacchetto catering trovato. Creane uno qui sopra!
                      </td>
                    </tr>
                  ) : (
                    pacchetti.map((p) => (
                      <tr key={p.uuid}>
                        <td className="ps-4">
                          <img
                            src={p.immagine || PLACEHOLDER_IMG}
                            alt={p.nome}
                            style={{
                              width: 55,
                              height: 55,
                              objectFit: "cover",
                              borderRadius: "10px",
                              border: "1px solid #dee2e6",
                            }}
                          />
                        </td>
                        <td className="fw-semibold text-dark">{p.nome}</td>
                        <td>€ {Number(p.prezzoPersona).toFixed(2)}</td>
                        <td>{p.numeroMinimoPersone} pax</td>
                        <td
                          className="text-end pe-4"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <Button
                            size="sm"
                            variant="outline-dark"
                            className="me-2 px-3 py-1"
                            style={{ borderRadius: "8px" }}
                            onClick={() => handleEdit(p)}
                          >
                            <i className="bi bi-pencil-fill me-1"></i> Modifica
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="px-3 py-1"
                            style={{ borderRadius: "8px" }}
                            onClick={() =>
                              setDaEliminare({ id: p.uuid, nome: p.nome })
                            }
                          >
                            <i className="bi bi-trash-fill me-1"></i> Elimina
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>

      {/* Modale di conferma eliminazione */}
      <Modal show={!!daEliminare} onHide={() => setDaEliminare(null)} centered>
        <div className="bg-white p-4 p-md-4 rounded-4 shadow">
          <h5
            className="text-dark fw-bold mb-3"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Confermi l'eliminazione?
          </h5>
          <p className="text-muted mb-4 small">
            Stai per eliminare definitivamente il pacchetto{" "}
            <strong className="text-danger">"{daEliminare?.nome}"</strong>.
            L'operazione non può essere annullata.
          </p>
          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={() => setDaEliminare(null)}
              className="px-4 py-2"
              style={{ borderRadius: "10px" }}
            >
              Annulla
            </Button>
            <Button
              onClick={confermaEliminazione}
              className="border-0 fw-bold px-4 py-2 bg-danger text-white"
              style={{ borderRadius: "10px" }}
            >
              Conferma ed Elimina
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminCatering;
