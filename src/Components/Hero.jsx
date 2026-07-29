import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/20210118_MAT_Presentazione concept_page-0014.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section text-white d-flex align-items-center justify-content-center position-relative"
      style={{
        minHeight: "85vh",
        width: "100%",
        background: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroImg}) center/cover no-repeat`,
        paddingTop: "120px",
        paddingBottom: "80px",
        overflow: "hidden",
      }}
    >
      <Container
        className="text-center position-relative"
        style={{ zIndex: 2 }}
      >
        <Row className="justify-content-center">
          <Col lg={9}>
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
              className="lead mb-4 fw-medium mx-auto"
              style={{
                fontSize: "1.2rem",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.9)",
                maxWidth: "700px",
              }}
            >
              Tradizione, passione artigianale e ingredienti genuini ogni
              singolo giorno per portare sulla tua tavola il profumo della vera
              qualità.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
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
            "linear-gradient(to bottom, transparent 0%, rgba(18, 18, 18, 0.6) 60%, #121212 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}

export default Hero;
