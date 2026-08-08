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

function SezioneCard({ children, style }) {
  return (
    <div
      className="p-4 p-lg-5 mb-4 position-relative overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "20px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background:
            "linear-gradient(90deg, transparent, #EED972, transparent)",
        }}
      />
      {children}
    </div>
  );
}

function LaboratorioDettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [laboratorio, setLaboratorio] = useState(null);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [fotoAttiva, setFotoAttiva] = useState(0);

  const [formData, setFormData] = useState({
    numeroPersone: 1,
    nomeCliente: "",
    cognomeCliente: "",
    emailCliente: "",
    telefonoCliente: "",
  });
  const [prenotazioneErrore, setPrenotazioneErrore] = useState(null);
  const [prenotazioneSuccesso, setPrenotazioneSuccesso] = useState(false);
  const [invioInCorso, setInvioInCorso] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/laboratori/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Laboratorio non trovato");
        return res.json();
      })
      .then((data) => {
        setLaboratorio(data);
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

  const handlePrenota = (e) => {
    e.preventDefault();
    if (!laboratorio) return;

    const token = localStorage.getItem("token");

    // Blocco immediato se l'utente non è loggato
    if (!token) {
      setPrenotazioneErrore(
        "Devi effettuare l'accesso per poter prenotare un laboratorio.",
      );
      return;
    }

    setPrenotazioneErrore(null);
    setInvioInCorso(true);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    fetch(`${API_URL}/prenotazioni`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        laboratorioId: laboratorio.uuid,
        numeroPersone: parseInt(formData.numeroPersone, 10),
        ...formData,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Errore durante la prenotazione");
          });
        }
        return res.json();
      })
      .then(() => setPrenotazioneSuccesso(true))
      .catch((err) => setPrenotazioneErrore(err.message))
      .finally(() => setInvioInCorso(false));
  };

  const formattaData = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (caricamento) {
    return (
      <div
        style={{
          backgroundColor: "#221915",
          minHeight: "100vh",
          paddingTop: "160px",
        }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#EED972" }} />
        </div>
      </div>
    );
  }

  if (errore || !laboratorio) {
    return (
      <div
        style={{
          backgroundColor: "#221915",
          minHeight: "100vh",
          paddingTop: "160px",
          color: "#f8f9fa",
        }}
      >
        <Container className="text-center">
          <p>{errore || "Laboratorio non trovato."}</p>
          <Button
            variant="outline-light"
            onClick={() => navigate("/laboratori")}
          >
            Torna ai laboratori
          </Button>
        </Container>
      </div>
    );
  }

  const galleriaFoto = laboratorio.galleria
    ? laboratorio.galleria.split(",").filter((u) => u.trim() !== "")
    : [];
  const tutteLeFoto = [
    laboratorio.immagine || PLACEHOLDER_IMG,
    ...galleriaFoto,
  ];

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 15% 5%, rgba(238,217,114,0.1) 0%, transparent 45%), linear-gradient(160deg, #2a1e18 0%, #1c1310 100%)",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          position: "relative",
          paddingTop: "140px",
          paddingBottom: "40px",
          background:
            "linear-gradient(to bottom, rgba(28,19,16,0.9), transparent)",
        }}
      >
        <Container>
          <Button
            variant="link"
            onClick={() => navigate("/laboratori")}
            className="text-decoration-none mb-3 p-0"
            style={{ color: "#EED972" }}
          >
            <i className="bi bi-arrow-left me-2"></i>Tutti i laboratori
          </Button>
          <h1
            className="fw-bold text-white mb-2 display-4"
            style={{
              fontFamily: "'Roboto Serif', serif",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            {laboratorio.nome}
          </h1>
          <p
            className="text-light opacity-90 mb-0 fs-5"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            <i
              className="bi bi-calendar-event me-2"
              style={{ color: "#EED972" }}
            ></i>
            {formattaData(laboratorio.dataOra)}
          </p>
        </Container>
      </div>

      <Container className="mt-4">
        <Row className="g-5">
          <Col lg={7}>
            <SezioneCard>
              <span
                className="d-block mb-3 text-uppercase"
                style={{
                  color: "#EED972",
                  fontSize: "0.75rem",
                  letterSpacing: "2px",
                }}
              >
                Galleria Fotografica
              </span>

              <div
                className="mb-3 overflow-hidden position-relative"
                style={{
                  borderRadius: "16px",
                  height: "380px",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <img
                  src={tutteLeFoto[fotoAttiva]}
                  alt="Laboratorio in primo piano"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
              </div>

              {tutteLeFoto.length > 1 && (
                <Row className="g-2">
                  {tutteLeFoto.map((foto, i) => (
                    <Col xs={4} sm={3} key={i}>
                      <div
                        onClick={() => setFotoAttiva(i)}
                        style={{
                          height: "85px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            i === fotoAttiva
                              ? "2px solid #EED972"
                              : "1px solid rgba(255,255,255,0.15)",
                          opacity: i === fotoAttiva ? 1 : 0.6,
                          transition: "all 0.2s ease-in-out",
                        }}
                        className="position-relative"
                      >
                        <img
                          src={foto}
                          alt={`Miniatura ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </SezioneCard>

            <SezioneCard>
              <p
                className="text-light opacity-90 mb-0"
                style={{ lineHeight: "1.8", fontSize: "1.05rem" }}
              >
                {laboratorio.descrizione}
              </p>
            </SezioneCard>

            {laboratorio.procedimento && (
              <SezioneCard>
                <span
                  className="d-block mb-3 text-uppercase"
                  style={{
                    color: "#EED972",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                  }}
                >
                  Cosa imparerai
                </span>
                <ol className="ps-3 mb-0">
                  {laboratorio.procedimento
                    .split("\n")
                    .filter((riga) => riga.trim() !== "")
                    .map((passo, i) => (
                      <li
                        key={i}
                        className="text-light opacity-90 mb-2"
                        style={{ lineHeight: "1.6" }}
                      >
                        {passo}
                      </li>
                    ))}
                </ol>
              </SezioneCard>
            )}

            {laboratorio.incluso && (
              <SezioneCard>
                <span
                  className="d-block mb-3 text-uppercase"
                  style={{
                    color: "#EED972",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                  }}
                >
                  Cosa è incluso
                </span>
                <ul className="list-unstyled mb-0">
                  {laboratorio.incluso
                    .split("\n")
                    .filter((riga) => riga.trim() !== "")
                    .map((item, i) => (
                      <li
                        key={i}
                        className="text-light opacity-90 mb-2 d-flex align-items-start gap-2"
                        style={{ lineHeight: "1.5" }}
                      >
                        <i
                          className="bi bi-check-circle-fill"
                          style={{ color: "#8fd19e", marginTop: "3px" }}
                        ></i>
                        <span>{item}</span>
                      </li>
                    ))}
                </ul>
              </SezioneCard>
            )}

            {laboratorio.istruttoreNome && (
              <SezioneCard>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={laboratorio.istruttoreFoto || PLACEHOLDER_IMG}
                    alt={laboratorio.istruttoreNome}
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(238,217,114,0.5)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <span
                      className="d-block text-uppercase mb-1"
                      style={{
                        color: "#EED972",
                        fontSize: "0.7rem",
                        letterSpacing: "1.5px",
                      }}
                    >
                      Il tuo istruttore
                    </span>
                    <h5 className="text-white fw-bold mb-1">
                      {laboratorio.istruttoreNome}
                    </h5>
                    {laboratorio.istruttoreBio && (
                      <p className="text-light opacity-75 small mb-0">
                        {laboratorio.istruttoreBio}
                      </p>
                    )}
                  </div>
                </div>
              </SezioneCard>
            )}

            <SezioneCard>
              <span
                className="d-block mb-3 text-uppercase"
                style={{
                  color: "#EED972",
                  fontSize: "0.75rem",
                  letterSpacing: "2px",
                }}
              >
                Cosa dicono i partecipanti
              </span>
              <Row className="g-3">
                {[
                  {
                    nome: "Maria C.",
                    testo:
                      "Esperienza fantastica, ho imparato tantissimo e il forno era pieno di profumi meravigliosi!",
                  },
                  {
                    nome: "Luca R.",
                    testo:
                      "Istruttori pazienti e disponibili. Sono tornato a casa con delle vere competenze, non solo un ricordo.",
                  },
                  {
                    nome: "Giulia F.",
                    testo:
                      "Perfetto anche per principianti assoluti come me. Consigliatissimo!",
                  },
                ].map((t, i) => (
                  <Col md={4} key={i}>
                    <div
                      className="p-3 h-100"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.05)",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <div
                        className="mb-2"
                        style={{ color: "#EED972", fontSize: "0.85rem" }}
                      >
                        ★★★★★
                      </div>
                      <p
                        className="text-light opacity-80 small mb-2"
                        style={{ lineHeight: "1.5", fontStyle: "italic" }}
                      >
                        "{t.testo}"
                      </p>
                      <span className="text-light opacity-60 small">
                        — {t.nome}
                      </span>
                    </div>
                  </Col>
                ))}
              </Row>
            </SezioneCard>
          </Col>

          <Col lg={5}>
            <div
              className="p-4 p-lg-5 position-relative overflow-hidden"
              style={{
                backgroundColor: "rgba(238, 217, 114, 0.06)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(238, 217, 114, 0.25)",
                borderRadius: "24px",
                boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                position: "sticky",
                top: "40px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, #EED972, transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-20%",
                  width: "70%",
                  height: "160%",
                  background:
                    "radial-gradient(circle, rgba(238,217,114,0.1) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div className="position-relative">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <div>
                    <span
                      className="fs-1 fw-bold"
                      style={{
                        color: "#EED972",
                        fontFamily: "'Roboto Serif', serif",
                      }}
                    >
                      € {laboratorio.prezzo.toFixed(2)}
                    </span>
                    <span className="text-light opacity-60 small ms-2">
                      / persona
                    </span>
                  </div>
                  <span
                    className="small px-3 py-1 rounded-pill"
                    style={{
                      backgroundColor:
                        laboratorio.postiDisponibili > 0
                          ? "rgba(143,209,158,0.15)"
                          : "rgba(224,133,133,0.15)",
                      color:
                        laboratorio.postiDisponibili > 0
                          ? "#8fd19e"
                          : "#e08585",
                      border: `1px solid ${laboratorio.postiDisponibili > 0 ? "rgba(143,209,158,0.3)" : "rgba(224,133,133,0.3)"}`,
                    }}
                  >
                    {laboratorio.postiDisponibili > 0
                      ? `${laboratorio.postiDisponibili} posti liberi`
                      : "Al completo"}
                  </span>
                </div>

                <div
                  className="mb-4"
                  style={{ borderTop: "1px solid rgba(238,217,114,0.2)" }}
                />

                {prenotazioneSuccesso ? (
                  <Alert variant="success">
                    Prenotazione confermata! Ti aspettiamo al laboratorio.
                  </Alert>
                ) : laboratorio.postiDisponibili === 0 ? (
                  <Alert variant="warning">
                    Questo laboratorio è al completo.
                  </Alert>
                ) : (
                  <Form onSubmit={handlePrenota}>
                    {prenotazioneErrore && (
                      <Alert
                        variant="danger"
                        className="d-flex flex-column gap-2"
                      >
                        <span>{prenotazioneErrore}</span>
                        {!localStorage.getItem("token") && (
                          <Button
                            size="sm"
                            onClick={() => navigate("/miei-ordini")}
                            className="align-self-start fw-bold mt-2 border-0 px-3 py-2"
                            style={{
                              backgroundColor: "rgba(238, 217, 114, 0.15)",
                              color: "#da9cb6",
                              borderRadius: "8px",
                              border: "1px solid rgba(238, 217, 114, 0.4)",
                              transition: "all 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(238, 217, 114, 0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "rgba(238, 217, 114, 0.15)";
                            }}
                          >
                            Accedi o Registrati →
                          </Button>
                        )}
                      </Alert>
                    )}

                    <Form.Group className="mb-3">
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={{
                          color: "#EED972",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Numero di persone
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max={laboratorio.postiDisponibili}
                        name="numeroPersone"
                        value={formData.numeroPersone}
                        onChange={handleChange}
                        required
                        className="checkout-input"
                      />
                    </Form.Group>

                    <Row className="g-3 mb-3">
                      <Col md={6}>
                        <Form.Label
                          className="small fw-semibold text-uppercase"
                          style={{
                            color: "#EED972",
                            fontSize: "0.7rem",
                            letterSpacing: "1px",
                          }}
                        >
                          Nome
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nomeCliente"
                          value={formData.nomeCliente}
                          onChange={handleChange}
                          required
                          className="checkout-input"
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Label
                          className="small fw-semibold text-uppercase"
                          style={{
                            color: "#EED972",
                            fontSize: "0.7rem",
                            letterSpacing: "1px",
                          }}
                        >
                          Cognome
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="cognomeCliente"
                          value={formData.cognomeCliente}
                          onChange={handleChange}
                          required
                          className="checkout-input"
                        />
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={{
                          color: "#EED972",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="emailCliente"
                        value={formData.emailCliente}
                        onChange={handleChange}
                        required
                        className="checkout-input"
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label
                        className="small fw-semibold text-uppercase"
                        style={{
                          color: "#EED972",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                        }}
                      >
                        Telefono
                      </Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefonoCliente"
                        value={formData.telefonoCliente}
                        onChange={handleChange}
                        required
                        className="checkout-input"
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={invioInCorso}
                      className="w-100 fw-bold border-0 py-3"
                      style={{
                        backgroundColor: "#EED972",
                        color: "#221915",
                        borderRadius: "12px",
                        boxShadow: "0 10px 30px rgba(238,217,114,0.25)",
                      }}
                    >
                      {invioInCorso
                        ? "Invio in corso..."
                        : "Conferma Prenotazione"}
                    </Button>
                  </Form>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LaboratorioDettaglio;
