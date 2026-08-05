import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { motion } from "framer-motion";

import imgDolce1 from "../assets/shop_dolci/20210319131959_PEPP7125.jpg";
import imgDolce2 from "../assets/shop_dolci/PEPP5460.jpg";
import imgPane from "../assets/shop_pane/PEPP5390.jpg";
import imgPizza from "../assets/shop_pizze/PEPP5044.jpg";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: (index % 6) * 0.08 },
  }),
};

const GALLERIE = {
  dolci: [imgDolce1, imgDolce2],
  pasticceria: [imgDolce1, imgDolce2],
  pane: [imgPane],
  panificazione: [imgPane],
  pizza: [imgPizza],
  pizze: [imgPizza],
};

function trovaGalleria(lab) {
  const testo = `${lab.nome} ${lab.descrizione}`.toLowerCase();
  for (const chiave in GALLERIE) {
    if (testo.includes(chiave)) return GALLERIE[chiave];
  }
  return [imgDolce1, imgPane, imgPizza];
}

function Laboratori() {
  const [laboratori, setLaboratori] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  const [labSelezionato, setLabSelezionato] = useState(null);

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

  const caricaLaboratori = () => {
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
    caricaLaboratori();
  }, []);

  const apriModale = (lab) => {
    setLabSelezionato(lab);
    setPrenotazioneErrore(null);
    setPrenotazioneSuccesso(false);
    setFormData({
      numeroPersone: 1,
      nomeCliente: "",
      cognomeCliente: "",
      emailCliente: "",
      telefonoCliente: "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrenota = (e) => {
    e.preventDefault();
    if (!labSelezionato) return;

    setPrenotazioneErrore(null);
    setInvioInCorso(true);

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    fetch(`${API_URL}/prenotazioni`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        laboratorioId: labSelezionato.uuid,
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
      .then(() => {
        setPrenotazioneSuccesso(true);
        caricaLaboratori();
      })
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

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(238,217,114,0.14) 0%, transparent 42%), linear-gradient(135deg, #9c6b52 0%, #834F41 40%, #6d4838 75%, #573b2e 100%)",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "120px",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <span
            className="text-uppercase fw-semibold small d-block mb-2"
            style={{ color: "#EED972", letterSpacing: "2px" }}
          >
            Impara con noi
          </span>
          <h1
            className="display-4 fw-bold mb-3 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            I Nostri Laboratori
          </h1>
          <p
            className="text-light opacity-75"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Scopri i segreti dell'arte bianca con i nostri panettieri, in
            laboratori pratici pensati per ogni livello di esperienza.
          </p>
        </div>

        {caricamento && (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
          </div>
        )}
        {errore && <p className="text-center text-light">{errore}</p>}

        {!caricamento && !errore && (
          <Row className="g-4">
            {laboratori.map((lab, index) => (
              <Col md={6} lg={4} key={lab.uuid}>
                <motion.div
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="h-100"
                >
                  <Card
                    className="h-100 border-0 text-white"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.09)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src={lab.immagine || PLACEHOLDER_IMG}
                        alt={lab.nome}
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column p-4">
                      <Card.Title
                        className="fw-bold text-white mb-2"
                        style={{ fontSize: "1.25rem" }}
                      >
                        {lab.nome}
                      </Card.Title>
                      <p className="small text-light opacity-75 mb-2">
                        {formattaData(lab.dataOra)}
                      </p>
                      <Card.Text className="text-light opacity-90 small mb-3 flex-grow-1">
                        {lab.descrizione}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold" style={{ color: "#EED972" }}>
                          € {lab.prezzo.toFixed(2)}
                        </span>
                        <span
                          className="small px-2 py-1 rounded-pill"
                          style={{
                            backgroundColor:
                              lab.postiDisponibili > 0
                                ? "rgba(143,209,158,0.15)"
                                : "rgba(224,133,133,0.15)",
                            color:
                              lab.postiDisponibili > 0 ? "#8fd19e" : "#e08585",
                          }}
                        >
                          {lab.postiDisponibili > 0
                            ? `${lab.postiDisponibili} posti liberi`
                            : "Al completo"}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          onClick={() => navigate(`/laboratori/${lab.uuid}`)}
                          variant="outline-light"
                          className="flex-grow-1 fw-semibold"
                          style={{ borderRadius: "10px" }}
                        >
                          Esplora
                        </Button>
                        <Button
                          disabled={lab.postiDisponibili === 0}
                          onClick={() => navigate(`/laboratori/${lab.uuid}`)}
                          className="flex-grow-1 fw-semibold border-0"
                          style={{
                            backgroundColor: "#EED972",
                            color: "#221915",
                            borderRadius: "10px",
                          }}
                        >
                          {lab.postiDisponibili > 0 ? "Prenota" : "Al completo"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {!caricamento && laboratori.length === 0 && (
          <p className="text-center text-light opacity-75">
            Nessun laboratorio disponibile al momento.
          </p>
        )}
      </Container>

      <Modal
        show={!!labSelezionato}
        onHide={() => setLabSelezionato(null)}
        centered
        size="lg"
        contentClassName="border-0 bg-transparent"
      >
        <div
          style={{
            position: "relative",
            backgroundColor: "rgba(34, 25, 21, 0.92)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(238, 217, 114, 0.25)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
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
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-25%",
              right: "-10%",
              width: "55%",
              height: "150%",
              background:
                "radial-gradient(circle, rgba(238,217,114,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <button
            onClick={() => setLabSelezionato(null)}
            aria-label="Chiudi"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              color: "#f8f9fa",
              fontSize: "1.3rem",
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>

          <div
            className="p-4 p-lg-5 text-white"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h3
              className="fw-bold mb-4"
              style={{
                fontFamily: "'Roboto Serif', serif",
                paddingRight: "40px",
              }}
            >
              {labSelezionato?.nome}
            </h3>

            {labSelezionato && !prenotazioneSuccesso && (
              <div className="mb-4 d-flex gap-2" style={{ overflowX: "auto" }}>
                {trovaGalleria(labSelezionato).map((foto, i) => (
                  <img
                    key={i}
                    src={foto}
                    alt=""
                    style={{
                      width: "120px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid rgba(238,217,114,0.25)",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}

            {!prenotazioneSuccesso && labSelezionato?.procedimento && (
              <div className="mb-4">
                <span
                  className="d-block mb-2 text-uppercase"
                  style={{
                    color: "#EED972",
                    fontSize: "0.75rem",
                    letterSpacing: "2px",
                  }}
                >
                  Cosa imparerai in questo laboratorio
                </span>
                <ol className="ps-3">
                  {labSelezionato.procedimento
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
              </div>
            )}

            {prenotazioneSuccesso ? (
              <Alert variant="success">
                Prenotazione confermata! Ti aspettiamo al laboratorio.
              </Alert>
            ) : (
              <Form onSubmit={handlePrenota}>
                {prenotazioneErrore && (
                  <Alert variant="danger">{prenotazioneErrore}</Alert>
                )}

                <Form.Group className="mb-3">
                  <Form.Label className="small text-light">
                    Numero di persone
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={labSelezionato?.postiDisponibili}
                    name="numeroPersone"
                    value={formData.numeroPersone}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                  />
                </Form.Group>

                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Label className="small text-light">Nome</Form.Label>
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
                    <Form.Label className="small text-light">
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
                  <Form.Label className="small text-light">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="emailCliente"
                    value={formData.emailCliente}
                    onChange={handleChange}
                    required
                    className="checkout-input"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="small text-light">Telefono</Form.Label>
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
                  className="w-100 fw-bold border-0 mt-2"
                  style={{
                    backgroundColor: "#EED972",
                    color: "#221915",
                    borderRadius: "10px",
                  }}
                >
                  {invioInCorso ? "Invio in corso..." : "Conferma Prenotazione"}
                </Button>
              </Form>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Laboratori;
