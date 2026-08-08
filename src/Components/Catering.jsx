import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

function Catering() {
  const [validated, setValidated] = useState(false);
  const [inviato, setInviato] = useState(false);

  // Stato per gestire la categoria selezionata da aprire nel modale/galleria
  const [categoriaSelezionata, setCategoriaSelezionata] = useState(null);

  // Dati con più foto per ciascuna categoria di catering
  const prodottiCatering = [
    {
      id: 1,
      titolo: "Pizze in Teglia Miste",
      descrizione: "Tranci soffici e fragranti con gusti classici e gourmet.",
      immaginePrincipale:
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80",
      galleria: [
        "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: 2,
      titolo: "Rustici Mignon",
      descrizione:
        "Sfogliatine, calzoncini e rustici assortiti per buffet dinamici.",
      immaginePrincipale:
        "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
      galleria: [
        "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: 3,
      titolo: "Pan Brioche Farcito",
      descrizione:
        "Morbidissimo pane artigianale ripieno con salumi e formaggi selezionati.",
      immaginePrincipale:
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
      galleria: [
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: 4,
      titolo: "Specialità Dolci e Secca",
      descrizione:
        "Pasticceria da forno, biscotti tradizionali e dolcetti per fine festa.",
      immaginePrincipale:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      galleria: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      setInviato(true);
    }
    setValidated(true);
  };

  const glassStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: "24px",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
  };

  const inputStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "12px",
    color: "#221915",
  };

  return (
    <div
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(252, 211, 77, 0.35) 0%, transparent 40%),
          radial-gradient(circle at 90% 85%, rgba(217, 119, 6, 0.25) 0%, transparent 50%),
          linear-gradient(135deg, #a46c52 0%, #7d4834 50%, #522d1f 100%)
        `,
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "140px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        {/* Intestazione */}
        <div className="text-center mb-5">
          <h1
            className="fw-bold display-5 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Catering & Eventi
          </h1>
          <p className="lead text-light opacity-85">
            Rendi unico ogni tuo momento speciale con i sapori autentici
            dell'Antico Forno Matillo.
          </p>
        </div>

        {/* Sezione Servizi */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="p-4 h-100 text-center" style={glassStyle}>
              <i className="bi bi-basket3-fill fs-1 text-warning mb-3"></i>
              <h4 className="text-white fw-bold">Buffet di Feste</h4>
              <p className="small text-light opacity-85">
                Pizze in teglia, rustici artigianali e preparazioni salate su
                misura per compleanni e ricorrenze.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100 text-center" style={glassStyle}>
              <i className="bi bi-shop fs-1 text-warning mb-3"></i>
              <h4 className="text-white fw-bold">Cerimonie</h4>
              <p className="small text-light opacity-85">
                Prodotti da forno di alta qualità, pan brioche farcito e
                specialità rustiche per impreziosire i tuoi ricevimenti.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="p-4 h-100 text-center" style={glassStyle}>
              <i className="bi bi-cup-hot-fill fs-1 text-warning mb-3"></i>
              <h4 className="text-white fw-bold">Coffee Break</h4>
              <p className="small text-light opacity-85">
                Soluzioni dolci e salate ideali per incontri aziendali, meeting
                e pause di lavoro piene di gusto.
              </p>
            </div>
          </Col>
        </Row>

        {/* Galleria Prodotti Interattiva */}
        <div className="mb-5">
          <h3
            className="text-white fw-bold text-center mb-2"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Esplora le Nostre Creazioni
          </h3>
          <p className="text-center text-light opacity-85 small mb-4">
            Clicca su una categoria per aprire la galleria fotografica dedicata.
          </p>
          <Row className="g-4">
            {prodottiCatering.map((prod) => (
              <Col md={3} sm={6} key={prod.id}>
                <div
                  className="h-100 overflow-hidden position-relative shadow-sm"
                  style={{
                    ...glassStyle,
                    borderRadius: "18px",
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={() => setCategoriaSelezionata(prod)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div style={{ height: "180px", overflow: "hidden" }}>
                    <img
                      src={prod.immaginePrincipale}
                      alt={prod.titolo}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h5 className="text-white fw-bold fs-6 mb-1">
                      {prod.titolo}
                    </h5>
                    <p
                      className="text-light opacity-85 small mb-0"
                      style={{ fontSize: "0.82rem" }}
                    >
                      {prod.descrizione}
                    </p>
                    <span
                      className="badge bg-warning text-dark mt-2"
                      style={{ fontSize: "0.7rem" }}
                    >
                      Vedi foto <i className="bi bi-arrow-right"></i>
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* MODALE PER LA GALLERIA FOTOGRAFICA DETTAGLIATA */}
        <Modal
          show={categoriaSelezionata !== null}
          onHide={() => setCategoriaSelezionata(null)}
          size="lg"
          centered
        >
          <div
            className="p-4"
            style={{
              backgroundColor: "#522d1f",
              color: "#fff",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {categoriaSelezionata && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4
                    className="fw-bold mb-0"
                    style={{ fontFamily: "'Roboto Serif', serif" }}
                  >
                    {categoriaSelezionata.titolo}
                  </h4>
                  <Button
                    variant="close"
                    className="btn-close-white"
                    onClick={() => setCategoriaSelezionata(null)}
                  />
                </div>
                <p className="small text-light opacity-85 mb-4">
                  {categoriaSelezionata.descrizione}
                </p>

                <Row className="g-3">
                  {categoriaSelezionata.galleria.map((foto, index) => (
                    <Col md={6} key={index}>
                      <div
                        style={{
                          height: "240px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        }}
                      >
                        <img
                          src={foto}
                          alt={`${categoriaSelezionata.titolo} ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </div>
        </Modal>

        {/* Form di Contatto / Preventivo */}
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="p-4 p-md-5" style={glassStyle}>
              <h3 className="text-white fw-bold text-center mb-3">
                Richiedi un Preventivo
              </h3>
              <p className="text-center small text-light opacity-85 mb-4">
                Compilare il modulo non impegna all'acquisto; ti ricontatteremo
                al più presto per definire i dettagli.
              </p>

              {inviato && (
                <Alert variant="success" className="text-center">
                  Richiesta inviata con successo! Ti ricontatteremo presto.
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small fw-semibold">
                        Nome e Cognome
                      </Form.Label>
                      <Form.Control type="text" required style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small fw-semibold">
                        Email
                      </Form.Label>
                      <Form.Control type="email" required style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small fw-semibold">
                        Telefono
                      </Form.Label>
                      <Form.Control type="tel" required style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-white small fw-semibold">
                        Data dell'Evento
                      </Form.Label>
                      <Form.Control type="date" required style={inputStyle} />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="text-white small fw-semibold">
                        Dettagli e Numero di Partecipanti
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required
                        style={inputStyle}
                        placeholder="Raccontaci di che tipo di evento si tratta e cosa vorresti ordinare..."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-center mt-4">
                    <Button
                      type="submit"
                      className="px-5 py-2 fw-bold border-0 shadow"
                      style={{
                        backgroundColor: "#fde047",
                        color: "#382316",
                        borderRadius: "12px",
                      }}
                    >
                      Invia Richiesta
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Catering;
