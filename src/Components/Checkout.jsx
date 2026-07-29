import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, totalPrice } = location.state || {
    cart: [],
    totalPrice: "0.00",
  };

  const [showLoginBox, setShowLoginBox] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const [shippingData, setShippingData] = useState({
    nome: "",
    cognome: "",
    email: "",
    indirizzo: "",
    citta: "",
    cap: "",
    telefono: "",
  });

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();

    const ordineCompleto = {
      ...shippingData,
      prodotti: cart,
      totale: totalPrice,
    };

    console.log("Invio ordine al backend:", ordineCompleto);
    alert(
      "Ordine completato con successo! Grazie per aver scelto Antico Forno Matillo.",
    );
    navigate("/");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Tentativo di login con:", loginData);
    alert("Login effettuato!");
    setShowLoginBox(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "90px",
      }}
    >
      <Container style={{ maxWidth: "900px" }}>
        <div className="text-center mb-5">
          <span
            className="text-warning text-uppercase tracking-widest fw-semibold small d-block mb-2"
            style={{ letterSpacing: "2px" }}
          >
            Antico Forno Matillo 1943
          </span>
          <h1
            className="display-4 fw-bold mb-3 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Checkout
          </h1>
          <p className="text-light opacity-75">
            Verifica il tuo carrello e completa i dati per la spedizione.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <div
              className="p-3 mb-4 rounded shadow-sm d-flex justify-content-between align-items-center gap-2"
              style={{
                backgroundColor: "rgba(45, 35, 30, 0.65)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <div>
                <h6 className="mb-0 text-white fw-bold">Hai già un account?</h6>
                <small className="text-light opacity-75">
                  Accedi per velocizzare il pagamento.
                </small>
              </div>
              <Button
                variant="outline-warning"
                size="sm"
                className="fw-semibold px-3"
                onClick={() => setShowLoginBox(!showLoginBox)}
              >
                {showLoginBox ? "Chiudi" : "Accedi"}
              </Button>
            </div>

            {showLoginBox && (
              <Card
                className="border-0 text-white mb-4 shadow-lg"
                style={{
                  backgroundColor: "rgba(34, 25, 21, 0.95)",
                  border: "1px solid rgba(212, 175, 55, 0.4)",
                  borderRadius: "16px",
                }}
              >
                <Card.Body className="p-4">
                  <h5
                    className="fw-bold mb-3 text-warning"
                    style={{ fontFamily: "'Roboto Serif', serif" }}
                  >
                    Accedi al tuo profilo
                  </h5>
                  <Form onSubmit={handleLoginSubmit}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small text-light">
                            Email
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                            style={{
                              backgroundColor: "#221915",
                              color: "#fff",
                              borderColor: "rgba(212,175,55,0.3)",
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small text-light">
                            Password
                          </Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                            style={{
                              backgroundColor: "#221915",
                              color: "#fff",
                              borderColor: "rgba(212,175,55,0.3)",
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} className="text-end mt-3">
                        <Button
                          type="submit"
                          variant="warning"
                          size="sm"
                          className="fw-semibold text-dark px-4"
                        >
                          Entra
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}

            <Card
              className="border-0 text-white shadow-lg"
              style={{
                backgroundColor: "rgba(45, 35, 30, 0.55)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(212, 175, 55, 0.2)",
              }}
            >
              <Card.Body className="p-4">
                <h4
                  className="fw-bold mb-4 text-white"
                  style={{ fontFamily: "'Roboto Serif', serif" }}
                >
                  Indirizzo di Spedizione
                </h4>

                <Form onSubmit={handleCheckoutSubmit}>
                  <Row className="g-3 mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small text-light">
                          Nome *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="nome"
                          value={shippingData.nome}
                          onChange={handleShippingChange}
                          required
                          style={{
                            backgroundColor: "#221915",
                            color: "#fff",
                            borderColor: "rgba(212,175,55,0.3)",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small text-light">
                          Cognome *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="cognome"
                          value={shippingData.cognome}
                          onChange={handleShippingChange}
                          required
                          style={{
                            backgroundColor: "#221915",
                            color: "#fff",
                            borderColor: "rgba(212,175,55,0.3)",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-light">
                      Email *
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      required
                      style={{
                        backgroundColor: "#221915",
                        color: "#fff",
                        borderColor: "rgba(212,175,55,0.3)",
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-light">
                      Indirizzo *
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="indirizzo"
                      placeholder="Via Roma 10"
                      value={shippingData.indirizzo}
                      onChange={handleShippingChange}
                      required
                      style={{
                        backgroundColor: "#221915",
                        color: "#fff",
                        borderColor: "rgba(212,175,55,0.3)",
                      }}
                    />
                  </Form.Group>

                  <Row className="g-3 mb-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="small text-light">
                          Città *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="citta"
                          value={shippingData.citta}
                          onChange={handleShippingChange}
                          required
                          style={{
                            backgroundColor: "#221915",
                            color: "#fff",
                            borderColor: "rgba(212,175,55,0.3)",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small text-light">
                          CAP *
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="cap"
                          value={shippingData.cap}
                          onChange={handleShippingChange}
                          required
                          style={{
                            backgroundColor: "#221915",
                            color: "#fff",
                            borderColor: "rgba(212,175,55,0.3)",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label className="small text-light">
                          Telefono
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="telefono"
                          value={shippingData.telefono}
                          onChange={handleShippingChange}
                          style={{
                            backgroundColor: "#221915",
                            color: "#fff",
                            borderColor: "rgba(212,175,55,0.3)",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    variant="warning"
                    size="lg"
                    className="w-100 py-3 fw-bold text-dark shadow"
                  >
                    Conferma e Paga
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card
              className="border-0 text-white shadow-lg sticky-top"
              style={{
                backgroundColor: "rgba(45, 35, 30, 0.65)",
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                top: "100px",
              }}
            >
              <Card.Body className="p-4">
                <h4
                  className="fw-bold mb-3 text-warning"
                  style={{ fontFamily: "'Roboto Serif', serif" }}
                >
                  Riepilogo Ordine
                </h4>

                {cart.length === 0 ? (
                  <p className="text-light opacity-75 small">
                    Il carrello è vuoto. Torna allo shop per aggiungere
                    prodotti.
                  </p>
                ) : (
                  <div
                    className="mb-3"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25"
                      >
                        <span className="small text-light">{item.name}</span>
                        <span className="small text-warning fw-semibold">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center fs-5 fw-bold">
                  <span>Totale:</span>
                  <span className="text-warning">€ {totalPrice}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Checkout;
