import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { motion } from "framer-motion";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

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

function Laboratori() {
  const navigate = useNavigate();
  const [laboratori, setLaboratori] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
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
  }, []);

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
          "radial-gradient(circle at 12% 8%, rgba(238,217,114,0.14) 0%, transparent 42%), radial-gradient(circle at 82% 10%, rgba(232,119,34,0.35) 0%, transparent 58%), linear-gradient(160deg, #e87722 0%, #d95c14 16%, #8a3e1c 45%, #2b1f1a 78%, #1c1613 100%)",
        backgroundAttachment: "fixed",
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
                      <Button
                        disabled={lab.postiDisponibili === 0}
                        onClick={() => navigate(`/laboratori/${lab.uuid}`)}
                        className="w-100 fw-semibold border-0"
                        style={{
                          backgroundColor: "#EED972",
                          color: "#221915",
                          borderRadius: "10px",
                        }}
                      >
                        {lab.postiDisponibili > 0 ? "Prenota" : "Al completo"}
                      </Button>
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
    </div>
  );
}

export default Laboratori;
