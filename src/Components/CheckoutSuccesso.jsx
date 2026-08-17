import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function CheckoutSuccesso() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [utenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  useEffect(() => {
    if (utenteLoggato) {
      const timer = setTimeout(() => navigate("/miei-ordini"), 3500);
      return () => clearTimeout(timer);
    }
  }, [utenteLoggato, navigate]);

  return (
    <div className="checkout-page-wrapper">
      <Container
        className="checkout-container d-flex align-items-center justify-content-center"
        style={{ minHeight: "60vh" }}
      >
        <Card
          className="checkout-box border-0 text-white shadow-lg mx-auto"
          style={{ maxWidth: "560px" }}
        >
          <Card.Body className="p-4 p-md-5 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center mx-auto mb-3"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "rgba(143,209,158,0.15)",
                border: "1px solid rgba(143,209,158,0.4)",
                color: "#8fd19e",
                fontSize: "1.8rem",
              }}
            >
              <i className="bi bi-check2"></i>
            </div>
            <h4 className="checkout-gold-title fw-bold mb-2">
              Pagamento ricevuto!
            </h4>
            <p className="checkout-text-muted mb-4">
              Grazie per aver scelto Antico Forno Matillo. Ti abbiamo mandato
              una conferma via email
              {sessionId && (
                <>
                  {" "}
                  (riferimento: <code>{sessionId.slice(-8)}</code>)
                </>
              )}
              .
            </p>
            {utenteLoggato ? (
              <p className="checkout-text-muted small mb-4">
                Tra pochi secondi ti portiamo automaticamente ai tuoi ordini.
              </p>
            ) : (
              <p className="checkout-text-muted small mb-4">
                Per consultare lo stato dei tuoi ordini in futuro, ti
                consigliamo di creare un account.
              </p>
            )}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button
                className="checkout-btn-gold fw-semibold px-4 border-0"
                onClick={() => navigate("/shop")}
              >
                Torna allo Shop
              </Button>
              {utenteLoggato ? (
                <Button
                  variant="outline-light"
                  className="fw-semibold px-4"
                  onClick={() => navigate("/miei-ordini")}
                >
                  I miei ordini
                </Button>
              ) : (
                <Button
                  variant="outline-light"
                  className="fw-semibold px-4"
                  onClick={() => navigate("/accedi")}
                >
                  Crea un account
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default CheckoutSuccesso;
