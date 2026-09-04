import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

function SezioneCard({ children, style }) {
  return (
    <div
      className="p-4 p-lg-5 mb-4 position-relative overflow-hidden"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
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

  const [showModal, setShowModal] = useState(false);
  const [indiceModal, setIndiceModal] = useState(0);

  const [utenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  const [formData, setFormData] = useState({ numeroPersone: 1 });
  const [prenotazioneErrore, setPrenotazioneErrore] = useState(null);
  const [prenotazioneSuccesso, setPrenotazioneSuccesso] = useState(false);
  const [invioInCorso, setInvioInCorso] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/laboratori/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          let messaggioErrore = "Laboratorio non trovato";
          try {
            const errorData = await res.json();
            if (errorData && errorData.message) {
              messaggioErrore = errorData.message;
            }
          } catch {
            // Se la risposta non è in formato JSON
          }
          throw new Error(messaggioErrore);
        }
        return res.json();
      })
      .then((data) => {
        setLaboratorio(data);
        setCaricamento(false);
      })
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setErrore(
            "Impossibile connettersi al server. Verifica che sia attivo.",
          );
        } else {
          setErrore(err.message);
        }
        setCaricamento(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrenota = (e) => {
    e.preventDefault();
    if (!laboratorio) return;

    setPrenotazioneErrore(null);
    setInvioInCorso(true);

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/prenotazioni`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        laboratorioId: laboratorio.uuid,
        numeroPersone: parseInt(formData.numeroPersone, 10),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          let messaggioErrore = "Errore durante la prenotazione";
          try {
            const errData = await res.json();
            if (errData && errData.message) {
              messaggioErrore = errData.message;
            }
          } catch {
            // Se la risposta non è in formato JSON
          }
          throw new Error(messaggioErrore);
        }
        return res.json();
      })
      .then(() => setPrenotazioneSuccesso(true))
      .catch((err) => {
        if (err.message === "Failed to fetch") {
          setPrenotazioneErrore(
            "Impossibile connettersi al server. Verifica che sia attivo.",
          );
        } else {
          setPrenotazioneErrore(err.message);
        }
      })
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
          backgroundColor: "#1c1613",
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
          backgroundColor: "#1c1613",
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
          "radial-gradient(circle at 15% 5%, rgba(238,217,114,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 8%, rgba(232,119,34,0.3) 0%, transparent 55%), linear-gradient(160deg, #e87722 0%, #d95c14 14%, #8a3e1c 42%, #2b1f1a 75%, #1c1613 100%)",
        backgroundAttachment: "fixed",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "70vh",
          minHeight: "480px",
          marginTop: "0",
        }}
      >
        <img
          src={tutteLeFoto[fotoAttiva]}
          alt={laboratorio.nome}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(28,19,16,0.98) 0%, rgba(28,19,16,0.6) 40%, rgba(28,19,16,0.15) 70%, transparent 100%)",
          }}
        />

        <Container
          className="position-absolute"
          style={{
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
          }}
        >
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
              textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            }}
          >
            {laboratorio.nome}
          </h1>
          <p
            className="text-light opacity-90 mb-0"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}
          >
            <i
              className="bi bi-calendar-event me-2"
              style={{ color: "#EED972" }}
            ></i>
            {formattaData(laboratorio.dataOra)}
          </p>
        </Container>
      </div>

      {tutteLeFoto.length > 1 && (
        <Container className="mt-5">
          <SezioneCard>
            <span
              className="d-block mb-3 text-uppercase"
              style={{
                color: "#EED972",
                fontSize: "0.75rem",
                letterSpacing: "2px",
              }}
            >
              La Galleria del Laboratorio
            </span>
            <Row className="g-3">
              {tutteLeFoto.map((foto, i) => (
                <Col xs={6} md={3} key={i}>
                  <div
                    onClick={() => {
                      setFotoAttiva(i);
                      setIndiceModal(i);
                      setShowModal(true);
                    }}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        i === fotoAttiva
                          ? "2px solid #EED972"
                          : "1px solid rgba(255,255,255,0.15)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                      transition: "transform 0.3s ease",
                    }}
                    className="galleria-foto-item"
                  >
                    <img
                      src={foto}
                      alt=""
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </SezioneCard>
        </Container>
      )}

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        contentClassName="bg-transparent border-0"
      >
        <Modal.Body className="p-0 position-relative">
          <Button
            variant="dark"
            onClick={() => setShowModal(false)}
            style={{
              position: "absolute",
              top: "-40px",
              right: "0",
              zIndex: 10,
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </Button>

          <Carousel
            activeIndex={indiceModal}
            onSelect={(selectedIndex) => setIndiceModal(selectedIndex)}
            interval={null}
            indicators={tutteLeFoto.length > 1}
          >
            {tutteLeFoto.map((foto, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="d-block w-100 rounded-4 shadow-lg"
                  src={foto}
                  alt={`Slide ${idx + 1}`}
                  style={{
                    maxHeight: "75vh",
                    objectFit: "contain",
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Modal.Body>
      </Modal>

      <Container className="mt-5">
        <Row className="g-5">
          <Col lg={7}>
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
                    "radial-gradient(circle, rgba(232,119,34,0.15) 0%, transparent 70%)",
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

                {!utenteLoggato ? (
                  <div className="text-center py-2">
                    <p className="text-light opacity-80 mb-3">
                      Devi accedere al tuo account per prenotare questo
                      laboratorio.
                    </p>
                    <Button
                      onClick={() => navigate("/accedi")}
                      className="w-100 fw-bold border-0 py-3"
                      style={{
                        backgroundColor: "#EED972",
                        color: "#221915",
                        borderRadius: "12px",
                      }}
                    >
                      Accedi o Registrati
                    </Button>
                  </div>
                ) : prenotazioneSuccesso ? (
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
                      <Alert variant="danger">{prenotazioneErrore}</Alert>
                    )}

                    <Form.Group className="mb-4">
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
