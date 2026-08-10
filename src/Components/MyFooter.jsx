import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";

const colors = {
  char: "#2A1A10",
  crust: "#6E3A22",
  wheat: "#C98A34",
  gold: "#EED972",
  flour: "#F6EEDD",
};

const fontDisplay = "'Fraunces', 'Roboto Serif', serif";

const eyebrowStyle = {
  color: colors.wheat,
  fontSize: "0.72rem",
  letterSpacing: "1.5px",
  fontWeight: 600,
};

function RigaContatto({ icon, children, href }) {
  const content = (
    <>
      <i
        className={`bi ${icon}`}
        style={{ color: colors.wheat, marginTop: "2px" }}
        aria-hidden="true"
      ></i>
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <p className="small mb-2">
        <a
          href={href}
          className="d-flex align-items-start gap-2 text-decoration-none footer-contatto"
          style={{ color: `${colors.flour}cc` }}
        >
          {content}
        </a>
      </p>
    );
  }

  return (
    <p
      className="small mb-2 d-flex align-items-start gap-2"
      style={{ color: `${colors.flour}cc` }}
    >
      {content}
    </p>
  );
}

function MyFooter() {
  return (
    <footer className="pt-3 pb-3" style={{ backgroundColor: colors.char }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap');
        .footer-gestionale { color: rgba(246,238,221,0.55); transition: color .2s ease, text-decoration-color .2s ease; text-decoration: underline; text-decoration-color: transparent; }
        .footer-gestionale:hover, .footer-gestionale:focus-visible { color: ${colors.wheat}; text-decoration-color: ${colors.wheat}; }
        .footer-contatto { transition: color .2s ease; }
        .footer-contatto:hover, .footer-contatto:focus-visible { color: ${colors.gold} !important; }
        .footer-social {
          width: 36px;
          height: 36px;
          border: 1px solid ${colors.wheat}55;
          color: ${colors.flour}cc;
          transition: background-color .2s ease, color .2s ease, border-color .2s ease;
        }
        .footer-social:hover, .footer-social:focus-visible {
          background-color: ${colors.wheat};
          border-color: ${colors.wheat};
          color: ${colors.char};
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${colors.wheat}, ${colors.gold}, ${colors.wheat}, transparent)`,
        }}
      />

      <Container className="pt-3">
        <Row className="g-4">
          <Col lg={4} md={6} className="text-center text-md-start">
            <h5
              className="fw-semibold mb-1"
              style={{
                fontFamily: fontDisplay,
                color: colors.gold,
                fontSize: "1.5rem",
              }}
            >
              Antico Forno Matillo
            </h5>
            <p
              className="small mb-3 fst-italic"
              style={{ color: `${colors.wheat}dd` }}
            >
              Il profumo del pane vero, dal 1943.
            </p>
            <p
              className="small mb-0"
              style={{
                color: `${colors.flour}bb`,
                lineHeight: "1.7",
                maxWidth: "320px",
              }}
            >
              Dal 1943 portiamo avanti la tradizione dell'arte bianca, unendo la
              passione artigianale e ingredienti genuini per offrirti ogni
              giorno il profumo del vero pane fresco.
            </p>
            <div className="d-flex gap-2 justify-content-center justify-content-md-start mt-3">
              <a
                href="#"
                aria-label="Facebook"
                className="footer-social rounded-circle d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-facebook" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="footer-social rounded-circle d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-instagram" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                aria-label="TikTok"
                className="footer-social rounded-circle d-flex align-items-center justify-content-center"
              >
                <i className="bi bi-tiktok" aria-hidden="true"></i>
              </a>
            </div>
          </Col>

          <Col lg={4} md={6} className="text-center text-md-start">
            <span className="d-block mb-3 text-uppercase" style={eyebrowStyle}>
              Dove Siamo &amp; Contatti
            </span>
            <address className="mb-0" style={{ fontStyle: "normal" }}>
              <RigaContatto icon="bi-geo-alt-fill">
                Via Nocera 60, S.Antonio Abate (Na)
              </RigaContatto>
              <RigaContatto icon="bi-telephone-fill" href="tel:+390818738310">
                Tel: 081 873 8310
              </RigaContatto>
              <RigaContatto
                icon="bi-envelope-fill"
                href="mailto:info@anticofornomatillo.it"
              >
                Email: info@anticofornomatillo.it
              </RigaContatto>
            </address>
          </Col>

          <Col lg={4} md={12} className="text-center text-md-start">
            <span className="d-block mb-3 text-uppercase" style={eyebrowStyle}>
              Orari di Apertura
            </span>
            <RigaContatto icon="bi-clock-fill">
              Lunedì - Domenica: 04:00 - 21:00
            </RigaContatto>
            <RigaContatto icon="bi-calendar-x-fill">
              Sabato pomeriggio: Chiuso
            </RigaContatto>
          </Col>
        </Row>

        <hr
          className="my-3 mt-4"
          style={{ borderColor: `${colors.wheat}22`, opacity: 1 }}
        />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="small mb-0" style={{ color: `${colors.flour}88` }}>
              &copy; {new Date().getFullYear()} Antico Forno Matillo. Tutti i
              diritti riservati.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="small mb-0" style={{ color: `${colors.flour}88` }}>
              P.IVA 02634090225
              <span className="mx-2" style={{ color: `${colors.flour}44` }}>
                ·
              </span>
              <Link
                to="/login"
                className="text-decoration-none footer-gestionale"
              >
                Accesso gestionale
              </Link>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default MyFooter;
