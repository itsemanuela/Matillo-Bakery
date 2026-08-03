import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/20210118_MAT_Presentazione concept_page-0012.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section text-white d-flex align-items-center position-relative"
      style={{
        "--hero-bg": `url(${heroImg})`,
      }}
    >
      <Container fluid className="px-lg-5 position-relative hero-container-z">
        <Row className="align-items-center justify-content-end">
          <Col lg={6} xl={5} className="text-lg-start text-center px-4">
            <h1 className="hero-title display-4 fw-bold mb-3">
              L'arte del pane dal 1943
            </h1>
            <p className="hero-lead lead mb-4 fw-medium">
              Tradizione, passione artigianale e ingredienti genuini ogni
              singolo giorno per portare sulla tua tavola il profumo della vera
              qualità.
            </p>
            <div className="d-flex justify-content-lg-start justify-content-center gap-3 flex-wrap">
              <Button
                variant="outline-light"
                size="lg"
                onClick={() => navigate("/shop")}
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

      <div className="hero-bottom-gradient"></div>
    </div>
  );
}

export default Hero;
