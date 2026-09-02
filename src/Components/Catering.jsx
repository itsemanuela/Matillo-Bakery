import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import GalleriaEventi from "../Components/GalleriaEventi";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

const colors = {
  char: "#1c1613",
  crust: "#b34a14",
  crustLight: "#d95c14",
  wheat: "#C98A34",
  gold: "#EED972",
  flour: "#F6EEDD",
  flourDim: "#E4D6BC",
};

const fontDisplay = "'Fraunces', 'Roboto Serif', serif";
const fontBody = "'Work Sans', sans-serif";

const scallop = (fillColor, size = 22) => ({
  height: `${size / 2}px`,
  width: "100%",
  backgroundImage: `radial-gradient(circle at ${size / 2}px 0, transparent ${
    size / 2 - 1
  }px, ${fillColor} ${size / 2}px)`,
  backgroundSize: `${size}px ${size}px`,
  backgroundRepeat: "repeat-x",
});

const scallopFlip = (fillColor, size = 22) => ({
  ...scallop(fillColor, size),
  transform: "scaleY(-1)",
});

const recipeCardStyle = {
  backgroundColor: colors.flour,
  color: colors.char,
  borderRadius: "0 0 6px 6px",
  boxShadow: "0 18px 36px rgba(20, 12, 6, 0.4)",
  paddingTop: "2.75rem",
  position: "relative",
};

const sealStyle = {
  position: "absolute",
  top: "-28px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: `radial-gradient(circle at 32% 28%, ${colors.gold}, ${colors.wheat})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow:
    "0 8px 16px rgba(20, 12, 6, 0.45), inset 0 0 0 3px rgba(42,26,16,0.15)",
};

function Catering() {
  const navigate = useNavigate();
  const [pacchetti, setPacchetti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/catering`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Errore nel caricamento dei pacchetti catering");
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
  }, []);

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(165deg, ${colors.char} 0%, ${colors.crust} 55%, ${colors.crustLight} 100%)`,
        backgroundBlendMode: "normal",
        color: colors.flour,
        minHeight: "100vh",
        paddingTop: "140px",
        paddingBottom: "0",
        fontFamily: fontBody,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,500&family=Work+Sans:wght@400;500&display=swap');
        .catering-recipe-card { transition: transform .35s ease, box-shadow .35s ease; }
        .catering-recipe-card:hover { transform: translateY(-6px) rotate(-0.6deg); }
        .catering-pack-card { transition: transform .35s ease, box-shadow .35s ease; }
        .catering-pack-card:hover { transform: translateY(-6px) rotate(0.7deg); }
        .catering-pack-card:nth-child(even):hover { transform: translateY(-6px) rotate(-0.7deg); }
      `}</style>

      <Container>
        <div className="text-center mb-5">
          <p
            className="mb-2 text-uppercase"
            style={{
              letterSpacing: "0.28em",
              fontSize: "0.72rem",
              color: colors.gold,
              fontWeight: 500,
            }}
          >
            Antico Forno Matillo
          </p>
          <h1
            className="fw-semibold display-5"
            style={{ fontFamily: fontDisplay, color: colors.flour }}
          >
            Catering &amp; Eventi
          </h1>
          <p
            className="lead mx-auto"
            style={{
              color: colors.flourDim,
              maxWidth: "560px",
              fontStyle: "italic",
            }}
          >
            Rendi unico ogni tuo momento speciale con i sapori autentici
            dell'Antico Forno Matillo.
          </p>
        </div>

        <Row className="g-4 gx-4" style={{ paddingTop: "8px" }}>
          {[
            {
              icon: "bi-basket3-fill",
              titolo: "Buffet di Feste",
              testo:
                "Pizze in teglia, rustici artigianali e preparazioni salate su misura per compleanni e ricorrenze.",
            },
            {
              icon: "bi-shop",
              titolo: "Cerimonie",
              testo:
                "Prodotti da forno di alta qualità, pan brioche farcito e specialità rustiche per impreziosire i tuoi ricevimenti.",
            },
            {
              icon: "bi-cup-hot-fill",
              titolo: "Coffee Break",
              testo:
                "Soluzioni dolci e salate ideali per incontri aziendali, meeting e pause di lavoro piene di gusto.",
            },
          ].map((cat) => (
            <Col md={4} key={cat.titolo}>
              <div
                className="h-100 text-center px-4 pb-4 catering-recipe-card"
                style={recipeCardStyle}
              >
                <div style={sealStyle}>
                  <i
                    className={`bi ${cat.icon}`}
                    style={{ fontSize: "1.4rem", color: colors.char }}
                  ></i>
                </div>
                <h4
                  className="fw-semibold mb-2"
                  style={{ fontFamily: fontDisplay, color: colors.crust }}
                >
                  {cat.titolo}
                </h4>
                <p className="small mb-0" style={{ color: "#5B4636" }}>
                  {cat.testo}
                </p>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: "56px" }} aria-hidden="true">
          <div style={scallop(colors.flour, 26)} />
        </div>

        <div
          style={{
            backgroundColor: colors.flour,
            paddingTop: "8px",
            paddingBottom: "72px",
          }}
        >
          <Container>
            <div className="text-center pt-4 mb-4">
              <h3
                className="fw-semibold mb-2"
                style={{ fontFamily: fontDisplay, color: colors.crust }}
              >
                I Nostri Pacchetti
              </h3>
              <p className="small mb-0" style={{ color: "#5B4636" }}>
                Scopri i dettagli e richiedi un preventivo su misura per il tuo
                evento.
              </p>
            </div>

            {caricamento && (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: colors.wheat }} />
              </div>
            )}
            {errore && (
              <p className="text-center" style={{ color: colors.crust }}>
                {errore}
              </p>
            )}

            {!caricamento && !errore && (
              <Row className="g-4">
                {pacchetti.map((pacchetto) => (
                  <Col md={3} sm={6} key={pacchetto.uuid}>
                    <div
                      className="h-100 overflow-hidden position-relative catering-pack-card"
                      style={{
                        backgroundColor: colors.flour,
                        borderRadius: "10px",
                        cursor: "pointer",
                        border: `1px solid ${colors.wheat}55`,
                        boxShadow: "0 12px 24px rgba(42,26,16,0.18)",
                      }}
                      onClick={() => navigate(`/catering/${pacchetto.uuid}`)}
                    >
                      <div style={{ height: "170px", overflow: "hidden" }}>
                        <img
                          src={pacchetto.immagine || PLACEHOLDER_IMG}
                          alt={pacchetto.nome}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div style={scallopFlip(colors.flour, 18)} />
                      <div className="p-3 pt-1 text-center">
                        <h5
                          className="fw-semibold fs-6 mb-1"
                          style={{
                            fontFamily: fontDisplay,
                            color: colors.crust,
                          }}
                        >
                          {pacchetto.nome}
                        </h5>
                        <p
                          className="small mb-2"
                          style={{ fontSize: "0.82rem", color: "#5B4636" }}
                        >
                          {pacchetto.descrizione}
                        </p>
                        <span
                          className="small fw-medium"
                          style={{ color: colors.wheat }}
                        >
                          Vedi dettagli <i className="bi bi-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
            {!caricamento && pacchetti.length === 0 && (
              <p className="text-center" style={{ color: "#5B4636" }}>
                Nessun pacchetto catering disponibile al momento.
              </p>
            )}

            <div
              className="mt-5 pt-4"
              style={{ borderTop: `1px solid ${colors.wheat}30` }}
            >
              <GalleriaEventi />
            </div>
          </Container>
        </div>
      </Container>
    </div>
  );
}

export default Catering;
