import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/20210118_MAT_Presentazione concept_page-0012.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <>
      <style>
        {`
          /* Impostazione di default (Desktop): immagine spostata a sinistra e in basso */
          .hero-section {
            background: linear-gradient(90deg, rgba(28, 22, 19, 0.3) 0%, rgba(28, 22, 19, 0.85) 45%, rgba(28, 22, 19, 0.95) 100%), url(${heroImg}) -25% -15% / cover no-repeat;
          }

          /* Su smartphone (schermi piccoli): rimettiamo l'immagine centrata e visibile */
          @media (max-width: 991.98px) {
            .hero-section {
              background: linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroImg}) center center / cover no-repeat !important;
            }
          }
        `}
      </style>

      <div
        className="hero-section text-white d-flex align-items-center position-relative"
        style={{
          minHeight: "85vh",
          width: "100%",
          backgroundColor: "#1c1613",
          paddingTop: "120px",
          paddingBottom: "80px",
          overflow: "hidden",
        }}
      >
        <Container
          fluid
          className="px-lg-5 position-relative"
          style={{ zIndex: 2 }}
        >
          <Row className="align-items-center justify-content-end">
            <Col lg={6} xl={5} className="text-lg-start text-center px-4">
              <h1
                className="display-4 fw-bold mb-3"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  textShadow: "0 3px 6px rgba(0, 0, 0, 0.9)",
                }}
              >
                L'arte del pane dal 1943
              </h1>
              <p
                className="lead mb-4 fw-medium"
                style={{
                  fontSize: "1.2rem",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
                }}
              >
                Tradizione, passione artigianale e ingredienti genuini ogni
                singolo giorno per portare sulla tua tavola il profumo della
                vera qualità.
              </p>
              <div className="d-flex justify-content-lg-start justify-content-center gap-3 flex-wrap">
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate("/prodotti")}
                  className="px-4 py-2 shadow-sm fw-semibold"
                >
                  Scopri i Prodotti
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  onClick={() => navigate("/ricette")}
                  className="px-4 py-2 text-dark fw-semibold shadow-sm"
                >
                  Le nostre Ricette
                </Button>
              </div>
            </Col>
          </Row>
        </Container>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "200px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(36, 29, 24, 0.8) 60%, #241d18 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        ></div>
      </div>
    </>
  );
}

export default Hero;
