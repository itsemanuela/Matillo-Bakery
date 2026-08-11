import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

function DettaglioProdotto({ prodotto, show, onHide, onAddToCart }) {
  if (!prodotto) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      contentClassName="border-0 bg-transparent"
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(28, 22, 19, 0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(238, 217, 114, 0.25)",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(238,217,114,0.05)",
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
            top: "-20%",
            right: "-10%",
            width: "60%",
            height: "140%",
            background:
              "radial-gradient(circle, rgba(232,119,34,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <button
          onClick={onHide}
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
            transition: "background 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(238,217,114,0.15)";
            e.currentTarget.style.transform = "rotate(90deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "rotate(0deg)";
          }}
        >
          ×
        </button>

        <Modal.Body
          style={{ padding: "2.5rem", position: "relative", zIndex: 1 }}
        >
          <Row className="g-4 align-items-start">
            <Col md={6}>
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  border: "1px solid rgba(238,217,114,0.2)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={prodotto.immagine || PLACEHOLDER_IMG}
                  alt={prodotto.nome}
                  style={{
                    width: "100%",
                    height: "340px",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              {prodotto.bestseller && (
                <div className="mb-3 d-inline-block">
                  <div
                    style={{
                      width: "50px",
                      height: "2px",
                      background:
                        "linear-gradient(90deg, transparent, #EED972, transparent)",
                      marginBottom: "8px",
                    }}
                  />
                  <span
                    className="d-block text-uppercase"
                    style={{
                      color: "#EED972",
                      letterSpacing: "3px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-star-fill me-1"></i> Bestseller
                  </span>
                </div>
              )}

              <h2
                className="fw-bold text-white mb-3"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: "2rem",
                }}
              >
                {prodotto.nome}
              </h2>

              <span
                className="d-inline-block mb-3 px-3 py-1 rounded-pill small fw-semibold"
                style={{
                  backgroundColor: "rgba(238,217,114,0.1)",
                  color: "#EED972",
                  border: "1px solid rgba(238,217,114,0.3)",
                  letterSpacing: "1px",
                }}
              >
                {prodotto.categoria}
              </span>

              <p
                className="text-light opacity-90 mb-4"
                style={{ fontSize: "1.05rem", lineHeight: "1.75" }}
              >
                {prodotto.descrizione}
              </p>

              <div
                className="d-flex align-items-center justify-content-between mb-4 pb-4"
                style={{ borderBottom: "1px solid rgba(238,217,114,0.15)" }}
              >
                <span className="fs-2 fw-bold" style={{ color: "#EED972" }}>
                  € {prodotto.prezzo.toFixed(2)}
                </span>
                <span
                  className="small px-2 py-1 rounded-pill"
                  style={{
                    color: prodotto.disponibile ? "#8fd19e" : "#e08585",
                    backgroundColor: prodotto.disponibile
                      ? "rgba(143,209,158,0.1)"
                      : "rgba(224,133,133,0.1)",
                  }}
                >
                  {prodotto.disponibile
                    ? `Disponibile (${prodotto.quantità} pz.)`
                    : "Esaurito"}
                </span>
              </div>

              <Button
                size="lg"
                disabled={!prodotto.disponibile}
                className="w-100 fw-bold border-0"
                style={{
                  backgroundColor: "#EED972",
                  color: "#221915",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(238,217,114,0.2)",
                }}
                onClick={() => {
                  onAddToCart(prodotto);
                  onHide();
                }}
              >
                {prodotto.disponibile
                  ? "Aggiungi al carrello"
                  : "Non disponibile"}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </div>
    </Modal>
  );
}

export default DettaglioProdotto;
