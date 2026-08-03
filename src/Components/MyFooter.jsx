import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function MyFooter() {
  return (
    <footer
      className="text-white pt-5 pb-3"
      style={{
        backgroundColor: "#6d4c41",
        borderTop: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <Container>
        <Row className="gy-4 justify-content-between">
          <Col lg={4} md={6} className="text-center text-md-start">
            <h5
              className="fw-bold mb-3"
              style={{ fontFamily: "'Roboto Serif', serif", color: "#EED972" }}
            >
              Antico Forno Matillo
            </h5>
            <p className="text-light small opacity-90 mb-3">
              Dal 1943 portiamo avanti la tradizione dell'arte bianca, unendo la
              passione artigianale e ingredienti genuini per offrirti ogni
              giorno il profumo del vero pane fresco.
            </p>
          </Col>

          <Col lg={4} md={6} className="text-center text-md-start">
            <h6
              className="fw-bold mb-3 text-uppercase tracking-wider small"
              style={{ color: "#EED972" }}
            >
              Dove Siamo & Contatti
            </h6>
            <p className="text-light small opacity-90 mb-2">
              <i
                className="bi bi-geo-alt-fill text-warning me-2"
                style={{ color: "#EED972 !important" }}
              ></i>{" "}
              Via Nocera 60, S.Antonio Abate (Na)
            </p>
            <p className="text-light small opacity-90 mb-2">
              <i
                className="bi bi-telephone-fill text-warning me-2"
                style={{ color: "#EED972 !important" }}
              ></i>{" "}
              Tel: 081 873 8310
            </p>
            <p className="text-light small opacity-90 mb-3">
              <i
                className="bi bi-envelope-fill text-warning me-2"
                style={{ color: "#EED972 !important" }}
              ></i>{" "}
              Email: info@anticofornomatillo.it
            </p>
          </Col>

          <Col lg={3} md={12} className="text-center text-md-start">
            <h6
              className="fw-bold mb-3 text-uppercase tracking-wider small"
              style={{ color: "#EED972" }}
            >
              Orari di Apertura
            </h6>
            <p className="text-light small opacity-90 mb-2">
              <i
                className="bi bi-clock-fill text-warning me-2"
                style={{ color: "#EED972 !important" }}
              ></i>{" "}
              Lunedì - Domenica: <br className="d-none d-lg-inline" />
              04:00 - 21:00
            </p>
            <p className="text-light small opacity-90 mb-0">
              <i
                className="bi bi-calendar-x-fill text-warning me-2"
                style={{ color: "#EED972 !important" }}
              ></i>{" "}
              Sabato pomeriggio: Chiuso
            </p>
          </Col>
        </Row>

        <hr className="my-4 border-light opacity-25" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="text-light small opacity-75 mb-0">
              &copy; {new Date().getFullYear()} Antico Forno Matillo. Tutti i
              diritti riservati.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="text-light small opacity-75 mb-0">
              P.IVA 02634090225
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default MyFooter;
