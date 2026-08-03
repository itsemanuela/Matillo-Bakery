import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const API_URL = "http://localhost:3001/api";

const CATEGORIE = ["PANE", "DOLCI", "PIZZE"];

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23e6ded5'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='9' fill='%238c6d46' text-anchor='middle' dy='.3em'%3EN/A%3C/text%3E%3C/svg%3E";

const FORM_VUOTO = {
  nome: "",
  categoria: "PANE",
  descrizione: "",
  prezzo: "",
  quantità: "",
  disponibile: true,
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function Admin() {
  const navigate = useNavigate();
  const [prodotti, setProdotti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  const [formData, setFormData] = useState(FORM_VUOTO);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [messaggio, setMessaggio] = useState(null);

  const caricaProdotti = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/prodotti`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento dei prodotti");
        return res.json();
      })
      .then((data) => {
        setProdotti(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaProdotti(false);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    navigate("/login");
  };

  const handleSetBestseller = (id) => {
    fetch(`${API_URL}/prodotti/${id}/bestseller`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore durante l'impostazione del bestseller");
        setMessaggio("Prodotto impostato come bestseller.");
        caricaProdotti(false);
      })
      .catch((err) => setErrore(err.message));
  };

  const resetForm = () => {
    setFormData(FORM_VUOTO);
    setEditingId(null);
    setImageFile(null);
  };

  const handleEdit = (prodotto) => {
    setFormData({
      nome: prodotto.nome,
      categoria: prodotto.categoria,
      descrizione: prodotto.descrizione || "",
      prezzo: prodotto.prezzo,
      quantità: prodotto.quantità,
      disponibile: prodotto.disponibile,
    });
    setEditingId(prodotto.uuid);
    setImageFile(null);
    setMessaggio(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id, nome) => {
    if (!window.confirm(`Eliminare "${nome}"? L'operazione è definitiva.`)) {
      return;
    }
    fetch(`${API_URL}/prodotti/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'eliminazione");
        setMessaggio(`"${nome}" eliminato.`);
        caricaProdotti();
      })
      .catch((err) => setErrore(err.message));
  };

  const caricaImmagine = (id) => {
    if (!imageFile) return Promise.resolve();

    const formDataImg = new FormData();
    formDataImg.append("file", imageFile);

    return fetch(`${API_URL}/prodotti/${id}/immagine`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formDataImg,
    }).then((res) => {
      if (!res.ok)
        throw new Error("Prodotto salvato, ma l'immagine non è stata caricata");
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrore(null);
    setMessaggio(null);

    const payload = {
      nome: formData.nome,
      categoria: formData.categoria,
      descrizione: formData.descrizione,
      prezzo: parseFloat(formData.prezzo),
      quantità: parseInt(formData.quantità, 10),
      disponibile: formData.disponibile,
    };

    const richiesta = editingId
      ? fetch(`${API_URL}/prodotti/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        })
      : fetch(`${API_URL}/prodotti`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify(payload),
        });

    richiesta
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante il salvataggio");
        return res.json();
      })
      .then((prodottoSalvato) => caricaImmagine(prodottoSalvato.uuid))
      .then(() => {
        setMessaggio(editingId ? "Prodotto aggiornato." : "Prodotto creato.");
        resetForm();
        caricaProdotti();
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setSubmitting(false));
  };

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

        .form-control, .form-select {
          background-color: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(184, 153, 122, 0.35) !important;
          color: #2c221e !important;
          border-radius: 12px !important;
          padding: 10px 14px;
          transition: all 0.2s ease;
        }

        .form-control:focus, .form-select:focus {
          background-color: #ffffff !important;
          border-color: #c29b46 !important;
          box-shadow: 0 0 0 4px rgba(194, 155, 70, 0.15) !important;
        }

        .form-control::file-selector-button {
          background-color: rgba(194, 155, 70, 0.12);
          color: #7d5e1d;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          margin-right: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .form-control::file-selector-button:hover {
          background-color: rgba(194, 155, 70, 0.22);
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
              Gestione Prodotti
            </h1>
            <p className="text-secondary small mb-0">
              Pannello di controllo amministrativo per il catalogo prodotti
            </p>
          </div>
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

        {/* Form Sezione Vetrata Chiara */}
        <div className="glass-card p-4 p-md-5 mb-5">
          <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary border-opacity-25">
            <h4
              className="mb-0 fw-semibold"
              style={{ fontSize: "1.25rem", color: "#2c221e" }}
            >
              {editingId ? "Modifica prodotto" : "Aggiungi nuovo prodotto"}
            </h4>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={6}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Nome Prodotto
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  placeholder="Es. Croissant artigianale"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Categoria
                </Form.Label>
                <Form.Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  {CATEGORIE.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Descrizione
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descrizione"
                  placeholder="Inserisci una descrizione dettagliata..."
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </Col>

              <Col md={4}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Prezzo (€)
                </Form.Label>
                <Form.Control
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
              <Col md={4}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Quantità in stock
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="quantità"
                  placeholder="0"
                  value={formData.quantità}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4} className="d-flex align-items-center pt-md-4">
                <Form.Check
                  type="checkbox"
                  id="disponibile"
                  name="disponibile"
                  label="Disponibile per la vendita"
                  checked={formData.disponibile}
                  onChange={handleChange}
                  className="text-dark custom-checkbox fw-medium"
                  style={{ cursor: "pointer" }}
                />
              </Col>

              <Col xs={12}>
                <Form.Label className="text-secondary small fw-bold text-uppercase tracking-wider">
                  Immagine{" "}
                  {editingId && (
                    <span className="text-muted fw-normal">
                      (lascia vuoto per mantenere l'attuale)
                    </span>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Col>
            </Row>

            <div className="d-flex gap-3 mt-4 pt-2">
              <Button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: "#c29b46",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  padding: "10px 24px",
                  boxShadow: "0 4px 14px rgba(194, 155, 70, 0.3)",
                }}
              >
                {submitting
                  ? "Salvataggio in corso..."
                  : editingId
                    ? "Salva Modifiche"
                    : "Crea Prodotto"}
              </Button>
              {editingId && (
                <Button
                  variant="outline-secondary"
                  onClick={resetForm}
                  style={{
                    borderRadius: "12px",
                    padding: "10px 20px",
                  }}
                >
                  Annulla
                </Button>
              )}
            </div>
          </Form>
        </div>

        {/* Tabella Prodotti Vetrata Chiara */}
        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#c29b46" }} />
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div style={{ overflowX: "auto" }}>
              <Table responsive className="admin-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Foto</th>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Prezzo</th>
                    <th>Stock</th>
                    <th>Stato</th>
                    <th>In evidenza</th>
                    <th className="text-end pe-4">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {prodotti.map((p) => (
                    <tr key={p.uuid}>
                      <td className="ps-4">
                        <img
                          src={p.immagine || PLACEHOLDER_IMG}
                          alt={p.nome}
                          style={{
                            width: 52,
                            height: 52,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid rgba(184,153,122,0.3)",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                          }}
                        />
                      </td>
                      <td className="fw-semibold text-dark">{p.nome}</td>
                      <td>
                        <span className="text-secondary small px-2 py-1 rounded bg-white bg-opacity-70 border border-secondary border-opacity-25">
                          {p.categoria}
                        </span>
                      </td>
                      <td className="fw-bold" style={{ color: "#9c7625" }}>
                        € {p.prezzo.toFixed(2)}
                      </td>
                      <td>{p.quantità}</td>
                      <td>
                        {p.disponibile ? (
                          <span
                            className="px-2.5 py-1 rounded-pill fw-semibold small d-inline-block"
                            style={{
                              backgroundColor: "rgba(40,167,69,0.12)",
                              color: "#1e7e34",
                              border: "1px solid rgba(40,167,69,0.25)",
                            }}
                          >
                            Disponibile
                          </span>
                        ) : (
                          <span
                            className="px-2.5 py-1 rounded-pill fw-semibold small d-inline-block"
                            style={{
                              backgroundColor: "rgba(220,53,69,0.12)",
                              color: "#bd2130",
                              border: "1px solid rgba(220,53,69,0.25)",
                            }}
                          >
                            Esaurito
                          </span>
                        )}
                      </td>
                      <td>
                        {p.bestseller ? (
                          <span
                            className="px-2.5 py-1 rounded-pill fw-semibold small d-inline-block"
                            style={{
                              backgroundColor: "rgba(194,155,70,0.18)",
                              color: "#8a6616",
                              border: "1px solid rgba(194,155,70,0.35)",
                            }}
                          >
                            ★ Bestseller
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleSetBestseller(p.uuid)}
                            style={{ fontSize: "0.8rem", borderRadius: "8px" }}
                          >
                            Imposta
                          </Button>
                        )}
                      </td>
                      <td
                        className="text-end pe-4"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <Button
                          size="sm"
                          variant="outline-dark"
                          className="me-2 px-3"
                          onClick={() => handleEdit(p)}
                          style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                        >
                          Modifica
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="px-3"
                          onClick={() => handleDelete(p.uuid, p.nome)}
                          style={{ borderRadius: "8px", fontSize: "0.85rem" }}
                        >
                          Elimina
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Admin;
