import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import heroImg from "../assets/20210118_MAT_Presentazione concept_page-0014.jpg";

function Hero() {
  return (
    <div
      className="hero-section text-white d-flex align-items-center position-relative"
      style={{
        minHeight: "100vh",
        width: "100vw",

        background: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${heroImg}) center/cover no-repeat`,
        marginTop: "-95px",
        overflow: "hidden",
        paddingTop: "190px",
        paddingBottom: "200px",
      }}
    >
      <Container
        className="text-center position-relative"
        style={{ zIndex: 2 }}
      >
        <Row className="justify-content-center">
          <Col lg={8}>
            <h1
              className="display-4 fw-bold mb-3"
              style={{
                fontFamily: "'Roboto Serif', serif",

                textShadow: "0 3px 6px rgba(0, 0, 0, 0.8)",
              }}
            >
              L'arte del pane dal 1943
            </h1>
            <p
              className="lead mb-4 fw-medium"
              style={{
                fontSize: "1.3rem",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              Tradizione, passione artigianale e ingredienti genuini ogni
              singolo giorno per portare sulla tua tavola il profumo della vera
              qualità.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="outline-light"
                size="lg"
                href="#prodotti"
                className="px-4 py-2 shadow-sm"
              >
                Scopri i Prodotti
              </Button>
              <Button
                variant="light"
                size="lg"
                href="#ricette"
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
          height: "350px",
          background: "linear-gradient(to bottom, transparent, #1a1a1a)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
}

export default Hero;
