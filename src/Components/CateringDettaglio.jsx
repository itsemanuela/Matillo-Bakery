import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

const colors = {
  char: "#2A1A10",
  crust: "#6E3A22",
  wheat: "#C98A34",
  gold: "#EED972",
  flour: "#F6EEDD",
  line: "#C98A3433",
  text: "#4A3626",
  textMuted: "#4A362699",
};

const fontDisplay = "'Fraunces', 'Roboto Serif', serif";
const fontBody = "'Work Sans', sans-serif";

const cardStyle = {
  backgroundColor: "#FFFFFF",
  border: `1px solid ${colors.line}`,
  borderLeft: `4px solid ${colors.wheat}`,
  borderRadius: "10px",
  boxShadow: "0 4px 16px rgba(42,26,16,0.06)",
};

const inputStyle = {
  backgroundColor: "#FFFFFF",
  border: `1px solid ${colors.wheat}55`,
  borderRadius: "8px",
  color: colors.char,
};

const labelStyle = {
  color: colors.crust,
  fontSize: "0.72rem",
  letterSpacing: "0.5px",
};

const eyebrowStyle = {
  color: colors.wheat,
  fontSize: "0.75rem",
  letterSpacing: "1.5px",
  fontWeight: 600,
};

function SezioneCard({ children, eyebrow }) {
  return (
    <div className="p-4 p-lg-4 mb-4" style={cardStyle}>
      {eyebrow && (
        <span className="d-block mb-3 text-uppercase" style={eyebrowStyle}>
          {eyebrow}
        </span>
      )}
      {children}
    </div>
  );
}

function CateringDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacchetto, setPacchetto] = useState(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [fotoAttiva, setFotoAttiva] = useState(0);

  const [formData, setFormData] = useState({
    nomeCliente: "",
    cognomeCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    dataEvento: "",
    numeroPersone: "",
    note: "",
  });
  const [richiestaErrore, setRichiestaErrore] = useState(null);
  const [richiestaSuccesso, setRichiestaSuccesso] = useState(false);
  const [invioInCorso, setInvioInCorso] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/catering/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pacchetto non trovato");
        return res.json();
      })
      .then((data) => {
        setPacchetto(data);
        setFormData((prev) => ({
          ...prev,
          numeroPersone: data.numeroMinimoPersone,
        }));
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRichiedi = (e) => {
    e.preventDefault();
    if (!pacchetto) return;

    setRichiestaErrore(null);
    setInvioInCorso(true);

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_URL}/richieste-catering`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        pacchettoId: pacchetto.uuid,
        numeroPersone: parseInt(formData.numeroPersone, 10),
        ...formData,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(
              err.message || "Errore durante l'invio della richiesta",
            );
          });
        }
        return res.json();
      })
      .then(() => setRichiestaSuccesso(true))
      .catch((err) => setRichiestaErrore(err.message))
      .finally(() => setInvioInCorso(false));
  };

  if (caricamento) {
    return (
      <div
        style={{
          backgroundColor: colors.flour,
          minHeight: "100vh",
          paddingTop: "160px",
        }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: colors.wheat }} />
        </div>
      </div>
    );
  }

  if (errore || !pacchetto) {
    return (
      <div
        style={{
          backgroundColor: colors.flour,
          minHeight: "100vh",
          paddingTop: "160px",
          color: colors.text,
        }}
      >
        <Container className="text-center">
          <p>{errore || "Pacchetto non trovato."}</p>
          <Button
            style={{ backgroundColor: colors.crust, border: "none" }}
            onClick={() => navigate("/catering")}
          >
            Torna al catering
          </Button>
        </Container>
      </div>
    );
  }

  const galleriaFoto = pacchetto.galleria
    ? pacchetto.galleria.split(",").filter((u) => u.trim() !== "")
    : [];
  const tutteLeFoto = [pacchetto.immagine || PLACEHOLDER_IMG, ...galleriaFoto];

  return (
    <div
      style={{
        backgroundColor: colors.flour,
        minHeight: "100vh",
        paddingTop: "128px",
        paddingBottom: "100px",
        fontFamily: fontBody,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Work+Sans:wght@400;500&display=swap');
        .cd-thumb { transition: border-color .2s ease, opacity .2s ease; opacity: 0.7; }
        .cd-thumb:hover { opacity: 1; }
        .cd-thumb.active { opacity: 1; }
        .cd-form-control:focus { border-color: ${colors.wheat} !important; box-shadow: 0 0 0 3px ${colors.wheat}22 !important; }
      `}</style>

      <Container>
        <Button
          variant="link"
          onClick={() => navigate("/catering")}
          className="text-decoration-none mb-3 p-0 d-inline-flex align-items-center"
          style={{ color: colors.crust, fontSize: "0.9rem" }}
        >
          <i className="bi bi-arrow-left me-2"></i>Tutti i pacchetti
        </Button>

        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <div>
            <span className="d-block mb-1 text-uppercase" style={eyebrowStyle}>
              Pacchetto catering
            </span>
            <h1
              className="fw-semibold mb-0"
              style={{
                fontFamily: fontDisplay,
                color: colors.char,
                fontSize: "2.4rem",
              }}
            >
              {pacchetto.nome}
            </h1>
          </div>
          <div className="d-flex gap-2">
            <span
              className="px-3 py-2 small fw-medium"
              style={{
                backgroundColor: colors.char,
                color: colors.gold,
                borderRadius: "8px",
              }}
            >
              € {pacchetto.prezzoPersona.toFixed(2)} / persona
            </span>
            <span
              className="px-3 py-2 small fw-medium"
              style={{
                backgroundColor: "#FFFFFF",
                color: colors.crust,
                border: `1px solid ${colors.line}`,
                borderRadius: "8px",
              }}
            >
              Min. {pacchetto.numeroMinimoPersone} pers.
            </span>
          </div>
        </div>

        <Row className="g-4 g-lg-5">
          <Col lg={7}>
            <div
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                aspectRatio: "4 / 3",
                border: `1px solid ${colors.line}`,
                boxShadow: "0 4px 16px rgba(42,26,16,0.08)",
              }}
            >
              <img
                src={tutteLeFoto[fotoAttiva]}
                alt={pacchetto.nome}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            {tutteLeFoto.length > 1 && (
              <div className="d-flex gap-2 mt-2 mb-4 flex-wrap">
                {tutteLeFoto.map((foto, i) => (
                  <div
                    key={i}
                    onClick={() => setFotoAttiva(i)}
                    className={`cd-thumb ${i === fotoAttiva ? "active" : ""}`}
                    style={{
                      width: "76px",
                      height: "56px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        i === fotoAttiva
                          ? `2px solid ${colors.wheat}`
                          : `1px solid ${colors.line}`,
                    }}
                  >
                    <img
                      src={foto}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <SezioneCard eyebrow="Descrizione">
              <p
                style={{
                  lineHeight: "1.75",
                  fontSize: "1rem",
                  color: colors.text,
                  marginBottom: 0,
                }}
              >
                {pacchetto.descrizione}
              </p>
            </SezioneCard>

            {pacchetto.incluso && (
              <SezioneCard eyebrow="Cosa è incluso">
                <ul className="list-unstyled mb-0">
                  {pacchetto.incluso
                    .split("\n")
                    .filter((riga) => riga.trim() !== "")
                    .map((item, i) => (
                      <li
                        key={i}
                        className="mb-2 d-flex align-items-start gap-2"
                        style={{ lineHeight: "1.5", color: colors.text }}
                      >
                        <i
                          className="bi bi-check2"
                          style={{ color: colors.wheat, marginTop: "3px" }}
                        ></i>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </SezioneCard>
            )}
          </Col>

          <Col lg={5}>
            <div
              className="p-4"
              style={{
                ...cardStyle,
                position: "sticky",
                top: "104px",
              }}
            >
              <h5
                className="fw-semibold mb-3"
                style={{ fontFamily: fontDisplay, color: colors.char }}
              >
                Richiedi un preventivo
              </h5>
              <p className="small mb-4" style={{ color: colors.textMuted }}>
                Compila il modulo: ti risponderemo con la disponibilità e i
                dettagli per il tuo evento.
              </p>

              {richiestaSuccesso ? (
                <Alert variant="success">
                  Richiesta inviata! Ti contatteremo presto per definire i
                  dettagli.
                </Alert>
              ) : (
                <Form onSubmit={handleRichiedi}>
                  {richiestaErrore && (
                    <Alert variant="danger">{richiestaErrore}</Alert>
                  )}

                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={labelStyle}
                      >
                        Nome
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nomeCliente"
                        value={formData.nomeCliente}
                        onChange={handleChange}
                        required
                        className="cd-form-control"
                        style={inputStyle}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={labelStyle}
                      >
                        Cognome
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="cognomeCliente"
                        value={formData.cognomeCliente}
                        onChange={handleChange}
                        required
                        className="cd-form-control"
                        style={inputStyle}
                      />
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="small fw-semibold text-uppercase"
                      style={labelStyle}
                    >
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="emailCliente"
                      value={formData.emailCliente}
                      onChange={handleChange}
                      required
                      className="cd-form-control"
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label
                      className="small fw-semibold text-uppercase"
                      style={labelStyle}
                    >
                      Telefono
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefonoCliente"
                      value={formData.telefonoCliente}
                      onChange={handleChange}
                      required
                      className="cd-form-control"
                      style={inputStyle}
                    />
                  </Form.Group>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={labelStyle}
                      >
                        Data evento
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="dataEvento"
                        value={formData.dataEvento}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="cd-form-control"
                        style={inputStyle}
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={labelStyle}
                      >
                        N. persone
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min={pacchetto.numeroMinimoPersone}
                        name="numeroPersone"
                        value={formData.numeroPersone}
                        onChange={handleChange}
                        required
                        className="cd-form-control"
                        style={inputStyle}
                      />
                    </Col>
                  </Row>
                  <Form.Group className="mb-4">
                    <Form.Label
                      className="small fw-semibold text-uppercase"
                      style={labelStyle}
                    >
                      Note (opzionale)
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      className="cd-form-control"
                      style={inputStyle}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={invioInCorso}
                    className="w-100 fw-semibold border-0 py-2 text-uppercase"
                    style={{
                      backgroundColor: colors.char,
                      color: colors.gold,
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {invioInCorso ? "Invio in corso..." : "Richiedi preventivo"}
                  </Button>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CateringDettaglio;
