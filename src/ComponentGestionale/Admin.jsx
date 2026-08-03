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
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='9' fill='%23EED972' text-anchor='middle' dy='.3em'%3EN/A%3C/text%3E%3C/svg%3E";

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
        if (!res.ok)
          throw new Error(
            "Errore durante l'eliminazione (verifica di essere loggata come admin)",
          );
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
        if (!res.ok)
          throw new Error(
            "Errore durante il salvataggio (verifica di essere loggata come admin)",
          );
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
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1
            className="fw-bold text-white mb-0"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Gestione Prodotti
          </h1>
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleLogout}
            style={{ borderRadius: "10px" }}
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
          className="p-4 mb-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.045)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "18px",
          }}
        >
          <h4 className="text-white mb-3">
            {editingId ? "Modifica prodotto" : "Nuovo prodotto"}
          </h4>
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="text-light">Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="text-light">Categoria</Form.Label>
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
                <Form.Label className="text-light">Descrizione</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                />
              </Col>

              <Col md={4}>
                <Form.Label className="text-light">Prezzo (€)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="prezzo"
                  value={formData.prezzo}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Label className="text-light">
                  Quantità in stock
                </Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="quantità"
                  value={formData.quantità}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Form.Check
                  type="checkbox"
                  id="disponibile"
                  name="disponibile"
                  label="Disponibile"
                  checked={formData.disponibile}
                  onChange={handleChange}
                  className="text-light mb-2"
                />
              </Col>

              <Col xs={12}>
                <Form.Label className="text-light">
                  Immagine {editingId && "(lascia vuoto per non modificarla)"}
                </Form.Label>
                <Form.Control
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
                style={{
                  backgroundColor: "#EED972",
                  color: "#221915",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 600,
                }}
              >
                {submitting
                  ? "Salvataggio..."
                  : editingId
                    ? "Salva modifiche"
                    : "Crea prodotto"}
              </Button>
              {editingId && (
                <Button
                  variant="outline-light"
                  onClick={resetForm}
                  style={{ borderRadius: "10px" }}
                >
                  Annulla modifica
                </Button>
              )}
            </div>
          </Form>
        </div>

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Table responsive variant="dark" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Prezzo</th>
                  <th>Stock</th>
                  <th>Stato</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {prodotti.map((p) => (
                  <tr key={p.uuid}>
                    <td>
                      <img
                        src={p.immagine || PLACEHOLDER_IMG}
                        alt={p.nome}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </td>
                    <td>{p.nome}</td>
                    <td>{p.categoria}</td>
                    <td>€ {p.prezzo.toFixed(2)}</td>
                    <td>{p.quantità}</td>
                    <td>
                      {p.disponibile ? (
                        <span style={{ color: "#8fd19e" }}>Disponibile</span>
                      ) : (
                        <span style={{ color: "#e08585" }}>Esaurito</span>
                      )}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-light"
                        className="me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Modifica
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(p.uuid, p.nome)}
                      >
                        Elimina
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Admin;
