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

const FORM_VUOTO = { titolo: "" };

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function fotoDiEvento(evento) {
  return evento.galleria
    ? evento.galleria.split(",").filter((u) => u.trim() !== "")
    : [];
}

function chiaveFile(file) {
  return `${file.name}-${file.size}-${file.lastModified}`;
}

function AdminGalleriaEventi() {
  const [eventi, setEventi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [messaggio, setMessaggio] = useState(null);

  const [formData, setFormData] = useState(FORM_VUOTO);
  const [editingId, setEditingId] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [daEliminare, setDaEliminare] = useState(null);
  const [eventoInModifica, setEventoInModifica] = useState(null);

  const caricaEventi = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/galleria-eventi`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento della galleria");
        return res.json();
      })
      .then((data) => {
        setEventi(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaEventi(false);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(FORM_VUOTO);
    setEditingId(null);
    setImageFiles([]);
    setEventoInModifica(null);
  };

  const handleEdit = (evento) => {
    setFormData({ titolo: evento.titolo || "" });
    setEditingId(evento.uuid);
    setEventoInModifica(evento);
    setImageFiles([]);
    setMessaggio(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const aggiungiFileSelezionati = (nuoviFile) => {
    setImageFiles((precedenti) => {
      const chiaviEsistenti = new Set(precedenti.map(chiaveFile));
      const daAggiungere = nuoviFile.filter(
        (f) => !chiaviEsistenti.has(chiaveFile(f)),
      );
      return [...precedenti, ...daAggiungere];
    });
  };

  const rimuoviFileSelezionato = (file) => {
    setImageFiles((precedenti) =>
      precedenti.filter((f) => chiaveFile(f) !== chiaveFile(file)),
    );
  };

  const confermaEliminazione = () => {
    if (!daEliminare) return;
    fetch(`${API_URL}/galleria-eventi/${daEliminare.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        setMessaggio("Evento eliminato con successo.");
        caricaEventi(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setDaEliminare(null));
  };

  const rimuoviFotoSingola = (url) => {
    if (!editingId) return;
    fetch(
      `${API_URL}/galleria-eventi/${editingId}/galleria?url=${encodeURIComponent(url)}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante la rimozione della foto");
        return res.json();
      })
      .then((aggiornato) => {
        setEventoInModifica(aggiornato);
        caricaEventi(false);
      })
      .catch((err) => setErrore(err.message));
  };

  const caricaFotoSuEvento = (id) => {
    if (imageFiles.length === 0) return Promise.resolve();
    const fd = new FormData();
    imageFiles.forEach((f) => fd.append("files", f));
    return fetch(`${API_URL}/galleria-eventi/${id}/galleria`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: fd,
    }).then((res) => {
      if (!res.ok)
        throw new Error("Evento salvato, ma le foto non sono state caricate");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!editingId && imageFiles.length === 0) {
      setErrore("Seleziona almeno una foto per l'evento.");
      return;
    }

    setSubmitting(true);
    setErrore(null);
    setMessaggio(null);

    const payload = { titolo: formData.titolo };

    const richiesta = editingId
      ? fetch(`${API_URL}/galleria-eventi/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        })
      : fetch(`${API_URL}/galleria-eventi`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });

    richiesta
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante il salvataggio dell'evento");
        return res.json();
      })
      .then((salvato) => caricaFotoSuEvento(salvato.uuid))
      .then(() => {
        setMessaggio(
          editingId
            ? "Evento aggiornato con successo."
            : "Nuovo evento creato con successo.",
        );
        resetForm();
        caricaEventi(false);
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
            Galleria Eventi
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

        <div
          className="p-4 p-md-5 mb-5 bg-white shadow-sm"
          style={{ border: "1px solid #e9ecef", borderRadius: "20px" }}
        >
          <h4
            className="text-dark fw-bold mb-4"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            {editingId ? "Modifica Evento" : "Aggiungi Evento alla Galleria"}
          </h4>

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={7}>
                <Form.Label className="text-secondary small fw-semibold">
                  Titolo evento
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="text"
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                  placeholder="Es. Matrimonio di Anna e Luca"
                />
              </Col>

              <Col md={5}>
                <Form.Label className="text-secondary small fw-semibold">
                  {editingId
                    ? "Aggiungi altre foto"
                    : "Foto (puoi selezionare più volte)"}
                </Form.Label>
                <Form.Control
                  className="admin-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    aggiungiFileSelezionati(Array.from(e.target.files));
                    e.target.value = "";
                  }}
                />
              </Col>
            </Row>

            {imageFiles.length > 0 && (
              <div className="mt-3">
                <span className="text-secondary small fw-semibold d-block mb-2">
                  Da caricare ({imageFiles.length})
                </span>
                <div className="d-flex flex-wrap gap-2">
                  {imageFiles.map((file) => (
                    <div
                      key={chiaveFile(file)}
                      style={{ position: "relative" }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #dee2e6",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => rimuoviFileSelezionato(file)}
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          border: "none",
                          backgroundColor: "#dc3545",
                          color: "#fff",
                          fontSize: "0.7rem",
                          lineHeight: 1,
                          cursor: "pointer",
                        }}
                        title="Togli questa foto dalla selezione"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingId &&
              eventoInModifica &&
              fotoDiEvento(eventoInModifica).length > 0 && (
                <div className="mt-4">
                  <span className="text-secondary small fw-semibold d-block mb-2">
                    Foto già caricate ({fotoDiEvento(eventoInModifica).length})
                  </span>
                  <div className="d-flex flex-wrap gap-2">
                    {fotoDiEvento(eventoInModifica).map((url) => (
                      <div key={url} style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt=""
                          style={{
                            width: 70,
                            height: 70,
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #dee2e6",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => rimuoviFotoSingola(url)}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            fontSize: "0.7rem",
                            lineHeight: 1,
                            cursor: "pointer",
                          }}
                          title="Rimuovi questa foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  ? `Caricamento di ${imageFiles.length || 1} foto...`
                  : editingId
                    ? "Salva Modifiche"
                    : "Crea Evento"}
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

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#a46c52" }} />
            <p className="text-muted mt-2 small">
              Caricamento galleria in corso...
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
                    <th className="ps-4">Anteprima</th>
                    <th>Titolo evento</th>
                    <th>Foto</th>
                    <th className="text-end pe-4">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {eventi.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        Nessun evento in galleria. Creane uno qui sopra!
                      </td>
                    </tr>
                  ) : (
                    eventi.map((evento) => {
                      const foto = fotoDiEvento(evento);
                      return (
                        <tr key={evento.uuid}>
                          <td className="ps-4">
                            <img
                              src={foto[0] || PLACEHOLDER_IMG}
                              alt={evento.titolo || "Evento"}
                              style={{
                                width: 55,
                                height: 55,
                                objectFit: "cover",
                                borderRadius: "10px",
                                border: "1px solid #dee2e6",
                              }}
                            />
                          </td>
                          <td className="text-dark fw-semibold">
                            {evento.titolo || (
                              <span className="text-muted fw-normal">—</span>
                            )}
                          </td>
                          <td className="text-muted">{foto.length} foto</td>
                          <td
                            className="text-end pe-4"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            <Button
                              size="sm"
                              variant="outline-dark"
                              className="me-2 px-3 py-1"
                              style={{ borderRadius: "8px" }}
                              onClick={() => handleEdit(evento)}
                            >
                              <i className="bi bi-pencil-fill me-1"></i>{" "}
                              Modifica
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="px-3 py-1"
                              style={{ borderRadius: "8px" }}
                              onClick={() =>
                                setDaEliminare({
                                  id: evento.uuid,
                                  titolo: evento.titolo,
                                })
                              }
                            >
                              <i className="bi bi-trash-fill me-1"></i> Elimina
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>

      <Modal show={!!daEliminare} onHide={() => setDaEliminare(null)} centered>
        <div className="bg-white p-4 p-md-4 rounded-4 shadow">
          <h5
            className="text-dark fw-bold mb-3"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Confermi l'eliminazione?
          </h5>
          <p className="text-muted mb-4 small">
            Stai per eliminare definitivamente l'evento{" "}
            <strong className="text-danger">
              "{daEliminare?.titolo || "senza titolo"}"
            </strong>{" "}
            e tutte le sue foto. L'operazione non può essere annullata.
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

export default AdminGalleriaEventi;
