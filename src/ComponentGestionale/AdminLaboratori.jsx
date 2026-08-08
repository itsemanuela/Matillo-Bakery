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
import Card from "react-bootstrap/Card";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F4EFEA'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='9' fill='%238C6D4F' text-anchor='middle' dy='.3em'%3EN/A%3C/text%3E%3C/svg%3E";

const FORM_VUOTO = {
  nome: "",
  descrizione: "",
  procedimento: "",
  incluso: "",
  istruttoreNome: "",
  istruttoreBio: "",
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
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [labDaEliminare, setLabDaEliminare] = useState(null);

  // Stati multimediali gestiti con logica cumulativa / separata
  const [galleriaFiles, setGalleriaFiles] = useState([]);
  const [istruttoreFotoFile, setIstruttoreFotoFile] = useState(null);

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
    const file = e.target.files[0] || null;
    setImageFile(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  // Gestione cumulativa dei file della galleria
  const handleGalleriaChange = (e) => {
    const nuoviFile = Array.from(e.target.files);
    setGalleriaFiles((filePrecedenti) => {
      const nomiEsistenti = new Set(filePrecedenti.map((f) => f.name));
      const fileFiltrati = nuoviFile.filter((f) => !nomiEsistenti.has(f.name));
      return [...filePrecedenti, ...fileFiltrati];
    });
    e.target.value = ""; // Reset dell'input per permettere selezioni ripetute dello stesso file se necessario
  };

  const handleRimuoviFileSingoloGalleria = (indexDaRimuovere) => {
    setGalleriaFiles((filePrecedenti) =>
      filePrecedenti.filter((_, index) => index !== indexDaRimuovere),
    );
  };

  const resetForm = () => {
    setFormData(FORM_VUOTO);
    setEditingId(null);
    setImageFile(null);
    setPreviewImage(null);
    setGalleriaFiles([]);
    setIstruttoreFotoFile(null);
  };

  const handleEdit = (lab) => {
    setFormData({
      nome: lab.nome,
      descrizione: lab.descrizione,
      dataOra: lab.dataOra ? lab.dataOra.slice(0, 16) : "",
      postiTotali: lab.postiTotali,
      prezzo: lab.prezzo,
      procedimento: lab.procedimento || "",
      incluso: lab.incluso || "",
      istruttoreNome: lab.istruttoreNome || "",
      istruttoreBio: lab.istruttoreBio || "",
    });
    setEditingId(lab.uuid);
    setImageFile(null);
    setPreviewImage(lab.immagine || null);
    setGalleriaFiles([]);
    setIstruttoreFotoFile(null);
    setMessaggio(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id, nome) => {
    setLabDaEliminare({ id, nome });
  };

  const confermaEliminazione = () => {
    if (!labDaEliminare) return;
    fetch(`${API_URL}/laboratori/${labDaEliminare.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        setMessaggio(`"${labDaEliminare.nome}" eliminato.`);
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setLabDaEliminare(null));
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

  const caricaGalleria = (id) => {
    if (galleriaFiles.length === 0) return Promise.resolve();
    const formDataGal = new FormData();
    galleriaFiles.forEach((f) => formDataGal.append("files", f));
    return fetch(`${API_URL}/laboratori/${id}/galleria`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formDataGal,
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          "Laboratorio salvato, ma la galleria non è stata caricata",
        );
    });
  };

  const caricaFotoIstruttore = (id) => {
    if (!istruttoreFotoFile) return Promise.resolve();
    const formDataIst = new FormData();
    formDataIst.append("file", istruttoreFotoFile);
    return fetch(`${API_URL}/laboratori/${id}/istruttore-foto`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formDataIst,
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          "Laboratorio salvato, ma la foto istruttore non è stata caricata",
        );
    });
  };

  const handleDeleteImmagine = (id) => {
    fetch(`${API_URL}/laboratori/${id}/immagine`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante la rimozione dell'immagine");
        return res.json();
      })
      .then(() => {
        setMessaggio("Immagine di copertina rimossa con successo.");
        setPreviewImage(null);
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message));
  };

  const handleDeleteGalleria = (id) => {
    fetch(`${API_URL}/laboratori/${id}/galleria`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante la rimozione della galleria");
        return res.json();
      })
      .then(() => {
        setMessaggio("Galleria rimossa con successo.");
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message));
  };

  const handleDeleteFotoIstruttore = (id) => {
    fetch(`${API_URL}/laboratori/${id}/istruttore-foto`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante la rimozione della foto istruttore");
        return res.json();
      })
      .then(() => {
        setMessaggio("Foto istruttore rimossa con successo.");
        caricaLaboratori(false);
      })
      .catch((err) => setErrore(err.message));
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
      incluso: formData.incluso,
      istruttoreNome: formData.istruttoreNome,
      istruttoreBio: formData.istruttoreBio,
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
      .then((salvato) => caricaImmagine(salvato.uuid).then(() => salvato))
      .then((salvato) => caricaGalleria(salvato.uuid).then(() => salvato))
      .then((salvato) => caricaFotoIstruttore(salvato.uuid))
      .then(() => {
        setMessaggio(
          editingId
            ? "Laboratorio aggiornato con successo."
            : "Laboratorio creato con successo.",
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
        backgroundColor: "#F9F6F0",
        color: "#2C221E",
        minHeight: "100vh",
        paddingTop: "140px",
        paddingBottom: "80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        .matillo-light-input, .matillo-light-input:focus {
          background-color: #FFFFFF !important;
          color: #2C221E !important;
          border: 1px solid #E2D9D0 !important;
          border-radius: 12px !important;
          padding: 0.75rem 1rem !important;
          font-size: 0.95rem;
          transition: all 0.2s ease-in-out;
        }
        .matillo-light-input:focus {
          border-color: #D4A373 !important;
          box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.15) !important;
        }
        .matillo-light-input::placeholder {
          color: #A0938C !important;
        }
        input[type="file"].matillo-light-input {
          padding: 0.6rem 1rem !important;
          color: #5C4D44 !important;
        }
        .matillo-light-table thead th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: #5C4D44;
          font-weight: 700;
          background-color: #F0EAE1 !important;
          border-bottom: 2px solid #E2D9D0 !important;
          padding: 16px !important;
        }
        .matillo-light-table tbody tr {
          transition: background-color 0.15s ease;
        }
        .matillo-light-table tbody tr:hover {
          background-color: rgba(212, 163, 115, 0.06) !important;
        }
        .matillo-light-table td {
          padding: 16px !important;
          vertical-align: middle;
          border-color: #EFE9E1 !important;
          color: #3D312B;
        }
        .matillo-light-card {
          background: #FFFFFF;
          border: 1px solid #EAE3DA;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(44, 34, 30, 0.04);
        }
        .btn-matillo-accent {
          background-color: #2C221E;
          color: #F9F6F0;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          padding: 0.75rem 1.75rem;
          transition: all 0.2s;
        }
        .btn-matillo-accent:hover:not(:disabled) {
          background-color: #40322C;
          color: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(44, 34, 30, 0.15);
        }
        .btn-matillo-light-outline {
          background-color: transparent;
          color: #2C221E;
          border: 1px solid #D1C7BC;
          border-radius: 12px;
          font-weight: 500;
          padding: 0.75rem 1.5rem;
          transition: all 0.2s;
        }
        .btn-matillo-light-outline:hover {
          background-color: #F0EAE1;
          border-color: #2C221E;
          color: #2C221E;
        }
      `}</style>

      <Container>
        {/* Intestazione */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1
              className="fw-bold mb-1"
              style={{
                fontFamily: "'Roboto Serif', serif",
                color: "#2C221E",
                letterSpacing: "-0.5px",
              }}
            >
              Gestione Laboratori
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
              Crea, modifica e organizza i corsi e i laboratori di "Mani in
              Pasta" di Matillo.
            </p>
          </div>
        </div>

        {errore && (
          <Alert
            variant="danger"
            onClose={() => setErrore(null)}
            dismissible
            className="border-0 shadow-sm rounded-4 mb-4"
            style={{ backgroundColor: "#F8D7DA", color: "#842029" }}
          >
            {errore}
          </Alert>
        )}
        {messaggio && (
          <Alert
            variant="success"
            onClose={() => setMessaggio(null)}
            dismissible
            className="border-0 shadow-sm rounded-4 mb-4"
            style={{ backgroundColor: "#D1E7DD", color: "#0F5132" }}
          >
            {messaggio}
          </Alert>
        )}

        {/* Form di Creazione / Modifica */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <div className="matillo-light-card p-4 p-md-5 h-100">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
                <h4
                  className="mb-0"
                  style={{
                    fontFamily: "'Roboto Serif', serif",
                    color: "#2C221E",
                  }}
                >
                  {editingId ? "Modifica Laboratorio" : "Nuovo Laboratorio"}
                </h4>
                {editingId && (
                  <span
                    className="badge px-3 py-2 rounded-pill"
                    style={{
                      backgroundColor: "#F4EFEA",
                      color: "#8C6D4F",
                      fontWeight: 500,
                    }}
                  >
                    Modifica in corso
                  </span>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col md={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Nome Laboratorio
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Es. Visita guidata Mani in Pasta"
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Posti Totali
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      type="number"
                      min="1"
                      name="postiTotali"
                      value={formData.postiTotali}
                      onChange={handleChange}
                      placeholder="Es. 15"
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Prezzo (€)
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      type="number"
                      step="0.01"
                      min="0"
                      name="prezzo"
                      value={formData.prezzo}
                      onChange={handleChange}
                      placeholder="Es. 10.00"
                      required
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Descrizione Principale
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      as="textarea"
                      rows={3}
                      name="descrizione"
                      value={formData.descrizione}
                      onChange={handleChange}
                      placeholder="Racconta l'esperienza del laboratorio..."
                      required
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Data e Ora
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      type="datetime-local"
                      name="dataOra"
                      value={formData.dataOra}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Procedimento{" "}
                      <span className="text-muted fw-normal">
                        (un passaggio per riga)
                      </span>
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      as="textarea"
                      rows={3}
                      name="procedimento"
                      value={formData.procedimento}
                      onChange={handleChange}
                      placeholder="Indossare grembiule e cappellino..."
                    />
                  </Col>

                  <Col xs={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Cosa è incluso{" "}
                      <span className="text-muted fw-normal">
                        (un elemento per riga)
                      </span>
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      as="textarea"
                      rows={2}
                      name="incluso"
                      value={formData.incluso}
                      onChange={handleChange}
                      placeholder="Kit da piccolo fornaio..."
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Nome Istruttore
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      type="text"
                      name="istruttoreNome"
                      value={formData.istruttoreNome}
                      onChange={handleChange}
                      placeholder="Es. Maestro Fornaio"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Foto Istruttore
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        className="matillo-light-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setIstruttoreFotoFile(e.target.files[0] || null)
                        }
                      />
                      {editingId && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="py-2 px-3"
                          style={{ borderRadius: "12px", whiteSpace: "nowrap" }}
                          type="button"
                          onClick={() => handleDeleteFotoIstruttore(editingId)}
                        >
                          Rimuovi
                        </Button>
                      )}
                    </div>
                  </Col>

                  <Col xs={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Bio Istruttore
                    </Form.Label>
                    <Form.Control
                      className="matillo-light-input"
                      as="textarea"
                      rows={2}
                      name="istruttoreBio"
                      value={formData.istruttoreBio}
                      onChange={handleChange}
                      placeholder="Breve biografia..."
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Immagine di Copertina
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2">
                      <Form.Control
                        className="matillo-light-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {editingId && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="py-2 px-3"
                          style={{ borderRadius: "12px", whiteSpace: "nowrap" }}
                          type="button"
                          onClick={() => handleDeleteImmagine(editingId)}
                        >
                          Rimuovi
                        </Button>
                      )}
                    </div>
                  </Col>

                  {/* Galleria Foto con Selezione Multipla Cumulativa */}
                  <Col md={12}>
                    <Form.Label
                      className="fw-semibold small text-uppercase tracking-wider mb-2"
                      style={{ color: "#5C4D44" }}
                    >
                      Galleria Foto{" "}
                    </Form.Label>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Form.Control
                        className="matillo-light-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleriaChange}
                      />
                      {editingId && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="py-2 px-3"
                          style={{ borderRadius: "12px", whiteSpace: "nowrap" }}
                          type="button"
                          onClick={() => handleDeleteGalleria(editingId)}
                        >
                          Rimuovi foto
                        </Button>
                      )}
                    </div>

                    {/* Lista di anteprima dei file locali accumulati */}
                    {galleriaFiles.length > 0 && (
                      <div
                        className="p-3 rounded-3 mt-2"
                        style={{
                          backgroundColor: "#F0EAE1",
                          border: "1px solid #E2D9D0",
                        }}
                      >
                        <div
                          className="small fw-semibold mb-2"
                          style={{ color: "#2C221E" }}
                        >
                          File pronti per il caricamento ({galleriaFiles.length}
                          ):
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {galleriaFiles.map((file, idx) => (
                            <div
                              key={idx}
                              className="d-flex align-items-center gap-2 bg-white px-3 py-1.5 rounded-pill shadow-sm"
                              style={{
                                border: "1px solid #E2D9D0",
                                fontSize: "0.85rem",
                              }}
                            >
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "150px" }}
                              >
                                {file.name}
                              </span>
                              <button
                                type="button"
                                className="btn-close"
                                style={{ fontSize: "0.6rem" }}
                                onClick={() =>
                                  handleRimuoviFileSingoloGalleria(idx)
                                }
                                aria-label="Rimuovi"
                              ></button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top border-light">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="btn-matillo-accent px-4"
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Salvataggio in corso...
                      </>
                    ) : editingId ? (
                      "Salva Modifiche"
                    ) : (
                      "Crea Laboratorio"
                    )}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outline-secondary"
                      onClick={resetForm}
                      className="btn-matillo-light-outline"
                    >
                      Annulla Modifica
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </Col>

          {/* Sezione Anteprima Shop in Tempo Reale */}
          <Col lg={5}>
            <div className="sticky-top" style={{ top: "110px" }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5
                  className="fw-bold mb-0"
                  style={{
                    fontFamily: "'Roboto Serif', serif",
                    color: "#2C221E",
                  }}
                >
                  <i
                    className="bi bi-eye me-2"
                    style={{ color: "#8C6D4F" }}
                  ></i>
                  Anteprima Shop Pubblico
                </h5>
                <span className="text-muted small">Live preview</span>
              </div>

              <Card
                className="border-0 shadow-sm"
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #EAE3DA",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    backgroundColor: "#F4EFEA",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={previewImage || PLACEHOLDER_IMG}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: previewImage ? "cover" : "contain",
                      padding: previewImage ? "0" : "40px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: "rgba(44, 34, 30, 0.85)",
                      backdropFilter: "blur(4px)",
                      color: "#F9F6F0",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    €{" "}
                    {formData.prezzo
                      ? Number(formData.prezzo).toFixed(2)
                      : "0.00"}
                  </div>
                </div>

                <Card.Body className="p-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span
                      className="small text-uppercase fw-bold"
                      style={{
                        color: "#8C6D4F",
                        letterSpacing: "1px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {formData.dataOra
                        ? new Date(formData.dataOra).toLocaleString("it-IT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Data e Ora da definire"}
                    </span>
                    <span
                      className="badge px-2.5 py-1 rounded-pill"
                      style={{
                        backgroundColor: "#F0EAE1",
                        color: "#5C4D44",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                      }}
                    >
                      {formData.postiTotali
                        ? `${formData.postiTotali} posti`
                        : "Posti liberi"}
                    </span>
                  </div>

                  <Card.Title
                    className="fw-bold mb-2"
                    style={{
                      fontFamily: "'Roboto Serif', serif",
                      color: "#2C221E",
                      fontSize: "1.25rem",
                    }}
                  >
                    {formData.nome || "Titolo del Laboratorio"}
                  </Card.Title>

                  <Card.Text
                    className="text-muted mb-4"
                    style={{
                      fontSize: "0.9rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {formData.descrizione ||
                      "La descrizione dettagliata del laboratorio apparirà qui in tempo reale mentre compili il modulo..."}
                  </Card.Text>

                  {formData.istruttoreNome && (
                    <div className="d-flex align-items-center pt-3 border-top border-light mb-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-2"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "#8C6D4F",
                          fontSize: "0.85rem",
                        }}
                      >
                        {formData.istruttoreNome.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div
                          className="small fw-semibold"
                          style={{ color: "#2C221E" }}
                        >
                          {formData.istruttoreNome}
                        </div>
                        <div
                          className="text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Maestro Istruttore
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="dark"
                    className="w-100 py-2.5 fw-semibold border-0"
                    style={{ backgroundColor: "#2C221E", borderRadius: "12px" }}
                    disabled
                  >
                    Prenota Esperienza
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Tabella Elenco Laboratori */}
        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#2C221E" }} />
          </div>
        ) : (
          <div className="matillo-light-card" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <Table
                responsive
                hover
                className="matillo-light-table mb-0 align-middle"
              >
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>Foto</th>
                    <th>Nome Laboratorio</th>
                    <th>Data & Ora</th>
                    <th>Posti</th>
                    <th>Prezzo</th>
                    <th className="text-end">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {laboratori.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        Nessun laboratorio presente nel sistema.
                      </td>
                    </tr>
                  ) : (
                    laboratori.map((lab) => (
                      <tr key={lab.uuid}>
                        <td>
                          <img
                            src={lab.immagine || PLACEHOLDER_IMG}
                            alt={lab.nome}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 10,
                              border: "1px solid #E2D9D0",
                            }}
                          />
                        </td>
                        <td>
                          <span
                            className="fw-semibold"
                            style={{ color: "#2C221E" }}
                          >
                            {lab.nome}
                          </span>
                        </td>
                        <td className="small text-muted">
                          {lab.dataOra
                            ? new Date(lab.dataOra).toLocaleString("it-IT")
                            : "-"}
                        </td>
                        <td>
                          <span
                            className="badge px-2.5 py-1 rounded-pill"
                            style={{
                              backgroundColor: "#F0EAE1",
                              color: "#5C4D44",
                              fontWeight: 500,
                            }}
                          >
                            {lab.postiDisponibili} / {lab.postiTotali} disp.
                          </span>
                        </td>
                        <td
                          className="fw-semibold"
                          style={{ color: "#8C6D4F" }}
                        >
                          € {lab.prezzo.toFixed(2)}
                        </td>
                        <td
                          className="text-end"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          <Button
                            size="sm"
                            variant="outline-dark"
                            className="me-2 px-3 py-1.5"
                            style={{
                              borderRadius: "8px",
                              borderColor: "#D1C7BC",
                            }}
                            onClick={() => handleEdit(lab)}
                          >
                            <i className="bi bi-pencil-fill me-1"></i> Modifica
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            className="px-3 py-1.5"
                            style={{ borderRadius: "8px" }}
                            onClick={() => handleDelete(lab.uuid, lab.nome)}
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

      {/* Modal di Conferma Eliminazione */}
      <Modal
        show={!!labDaEliminare}
        onHide={() => setLabDaEliminare(null)}
        centered
        contentClassName="border-0 bg-transparent"
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            border: "1px solid #E2D9D0",
            boxShadow: "0 20px 40px rgba(44, 34, 30, 0.15)",
            padding: "2rem",
          }}
        >
          <h5
            className="fw-bold mb-3"
            style={{ fontFamily: "'Roboto Serif', serif", color: "#2C221E" }}
          >
            Confermi l'eliminazione?
          </h5>
          <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
            Stai per eliminare definitivamente il laboratorio{" "}
            <strong style={{ color: "#2C221E" }}>
              "{labDaEliminare?.nome}"
            </strong>
            . Questa operazione non può essere annullata.
          </p>
          <div className="d-flex gap-3 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={() => setLabDaEliminare(null)}
              className="btn-matillo-light-outline py-2"
            >
              Annulla
            </Button>
            <Button
              onClick={confermaEliminazione}
              className="border-0 fw-semibold px-4 py-2"
              style={{
                backgroundColor: "#DC3545",
                color: "#fff",
                borderRadius: "12px",
              }}
            >
              Conferma Eliminazione
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminLaboratori;
