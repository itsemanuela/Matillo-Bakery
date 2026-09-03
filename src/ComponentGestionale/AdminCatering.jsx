import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
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
  const [pacchettiSelezionati, setPacchettiSelezionati] = useState([]);

  const caricaPacchetti = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/catering`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore");
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
    caricamento && caricaPacchetti(false);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGalleriaChange = (e) => {
    const nuoviFiles = Array.from(e.target.files);
    setGalleriaFiles((prev) => [...prev, ...nuoviFiles]);
  };

  const rimuoviFotoGalleria = (index) =>
    setGalleriaFiles((prev) => prev.filter((_, i) => i !== index));

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

  const toggleSelezionaTutti = () => {
    if (pacchettiSelezionati.length === pacchetti.length)
      setPacchettiSelezionati([]);
    else setPacchettiSelezionati(pacchetti.map((p) => p.uuid));
  };

  const toggleSelezionaSingolo = (uuid) => {
    setPacchettiSelezionati((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid],
    );
  };

  const confermaEliminazione = () => {
    if (!daEliminare) return;
    fetch(`${API_URL}/catering/${daEliminare.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore");
        setMessaggio(`Eliminato.`);
        setPacchettiSelezionati((prev) =>
          prev.filter((id) => id !== daEliminare.id),
        );
        caricaPacchetti(false);
      })
      .catch((err) => setErrore(err.message))
      .finally(() => setDaEliminare(null));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      prezzoPersona: parseFloat(formData.prezzoPersona),
      numeroMinimoPersone: parseInt(formData.numeroMinimoPersone, 10),
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
      .then((res) => res.json())
      .then((salvato) => {
        const p1 = imageFile
          ? fetch(`${API_URL}/catering/${salvato.uuid}/immagine`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: (() => {
                const fd = new FormData();
                fd.append("file", imageFile);
                return fd;
              })(),
            })
          : Promise.resolve();
        const p2 =
          galleriaFiles.length > 0
            ? fetch(`${API_URL}/catering/${salvato.uuid}/galleria`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: (() => {
                  const fd = new FormData();
                  galleriaFiles.forEach((f) => fd.append("files", f));
                  return fd;
                })(),
              })
            : Promise.resolve();
        return Promise.all([p1, p2]);
      })
      .then(() => {
        setMessaggio("Salvataggio completato.");
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
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .admin-input { background-color: #fff !important; border-radius: 12px !important; padding: 0.65rem 1rem !important; }
        .admin-table { background-color: #fff !important; }
      `}</style>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold mb-0 text-dark">Gestione Catering</h1>
          {pacchettiSelezionati.length > 0 && (
            <span>Selezionati: {pacchettiSelezionati.length}</span>
          )}
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
          style={{ borderRadius: "20px" }}
        >
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Control
                  className="admin-input"
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Nome"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  className="admin-input"
                  type="number"
                  step="0.01"
                  name="prezzoPersona"
                  value={formData.prezzoPersona}
                  onChange={handleChange}
                  required
                  placeholder="Prezzo"
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  className="admin-input"
                  type="number"
                  name="numeroMinimoPersone"
                  value={formData.numeroMinimoPersone}
                  onChange={handleChange}
                  required
                  placeholder="Persone Minime"
                />
              </Col>
              <Col xs={12}>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  name="descrizione"
                  value={formData.descrizione}
                  onChange={handleChange}
                  required
                  placeholder="Descrizione"
                />
              </Col>
              <Col xs={12}>
                <Form.Control
                  className="admin-input"
                  as="textarea"
                  name="incluso"
                  value={formData.incluso}
                  onChange={handleChange}
                  placeholder="Incluso (per riga)"
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  className="admin-input"
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  className="admin-input"
                  type="file"
                  multiple
                  onChange={handleGalleriaChange}
                />
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {galleriaFiles.map((f, i) => (
                    <div
                      key={i}
                      className="position-relative border p-1 rounded"
                    >
                      {f.name.substring(0, 10)}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => rimuoviFotoGalleria(i)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <Button
              type="submit"
              disabled={submitting}
              className="mt-4 bg-dark border-0"
            >
              Salva
            </Button>
          </Form>
        </div>
        <div
          className="bg-white shadow-sm"
          style={{ borderRadius: "16px", overflow: "hidden" }}
        >
          <Table responsive hover className="admin-table align-middle">
            <thead>
              <tr>
                <th className="ps-4">
                  <Form.Check
                    type="checkbox"
                    checked={
                      pacchetti.length > 0 &&
                      pacchettiSelezionati.length === pacchetti.length
                    }
                    onChange={toggleSelezionaTutti}
                  />
                </th>
                <th>Foto</th>
                <th>Nome</th>
                <th>Prezzo</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {pacchetti.map((p) => (
                <tr
                  key={p.uuid}
                  className={
                    pacchettiSelezionati.includes(p.uuid) ? "table-active" : ""
                  }
                >
                  <td className="ps-4">
                    <Form.Check
                      type="checkbox"
                      checked={pacchettiSelezionati.includes(p.uuid)}
                      onChange={() => toggleSelezionaSingolo(p.uuid)}
                    />
                  </td>
                  <td>
                    <img
                      src={p.immagine || PLACEHOLDER_IMG}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>
                  <td>{p.nome}</td>
                  <td>€ {Number(p.prezzoPersona).toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-dark"
                      className="me-2"
                      onClick={() => handleEdit(p)}
                    >
                      Modifica
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() =>
                        setDaEliminare({ id: p.uuid, nome: p.nome })
                      }
                    >
                      Elimina
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
      <Modal show={!!daEliminare} onHide={() => setDaEliminare(null)} centered>
        <Modal.Body>
          <h5>Confermi eliminazione di "{daEliminare?.nome}"?</h5>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary" onClick={() => setDaEliminare(null)}>
              No
            </Button>
            <Button variant="danger" onClick={confermaEliminazione}>
              Sì
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminCatering;
