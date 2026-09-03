import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

// Vista di sola lettura del catalogo, per controllo visivo rapido —

function AdminShopPreview() {
  const [prodotti, setProdotti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/prodotti`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento dei prodotti");
        return res.json();
      })
      .then((data) => {
        setProdotti(data);
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
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1
            className="fw-bold text-white mb-0"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Anteprima Shop
          </h1>
          <span className="small text-light opacity-75">
            Sola lettura — nessuna azione qui modifica i dati
          </span>
        </div>

        {errore && <p className="text-danger">{errore}</p>}

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
          </div>
        ) : prodotti.length === 0 ? (
          <p className="text-light opacity-75">Nessun prodotto nel catalogo.</p>
        ) : (
          <Row className="g-4">
            {prodotti.map((p) => (
              <Col md={6} lg={4} key={p.uuid}>
                <Card
                  className="h-100 border-0 text-white"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.045)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={p.immagine || PLACEHOLDER_IMG}
                      alt={p.nome}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                    {p.bestseller && (
                      <span
                        className="position-absolute px-2 py-1 rounded-pill fw-semibold small"
                        style={{
                          top: "10px",
                          left: "10px",
                          backgroundColor: "rgba(238,217,114,0.9)",
                          color: "#221915",
                        }}
                      >
                        <i className="bi bi-star-fill me-1"></i>Bestseller
                      </span>
                    )}
                    {!p.disponibile && (
                      <div
                        className="position-absolute px-2 py-1 rounded"
                        style={{
                          top: "10px",
                          right: "10px",
                          backgroundColor: "rgba(20,15,12,0.85)",
                          color: "#f8f9fa",
                          fontSize: "0.75rem",
                        }}
                      >
                        Esaurito
                      </div>
                    )}
                  </div>
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <Card.Title
                        className="fw-bold mb-0"
                        style={{ fontSize: "1.1rem" }}
                      >
                        {p.nome}
                      </Card.Title>
                      <span className="fw-bold" style={{ color: "#EED972" }}>
                        € {p.prezzo.toFixed(2)}
                      </span>
                    </div>
                    <span
                      className="d-inline-block px-2 py-1 rounded-pill small mt-2"
                      style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      {p.categoria}
                    </span>
                    <Card.Text className="text-light opacity-75 small mt-2 mb-0">
                      {p.descrizione}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default AdminShopPreview;
