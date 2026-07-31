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
    <div className="checkout-page-wrapper">
      <Container className="checkout-container">
        <div className="text-center mb-5">
          <span className="checkout-subtitle">Antico Forno Matillo 1943</span>
          <h1 className="checkout-main-title">Checkout</h1>
          <p className="text-light opacity-75">
            Verifica il tuo carrello e completa i dati per la spedizione.
          </p>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <div className="checkout-box p-4 mb-4 shadow-sm d-flex justify-content-between align-items-center gap-2">
              <div>
                <h6 className="mb-0 text-white fw-bold">Hai già un account?</h6>
                <small className="checkout-text-muted">
                  Accedi per velocizzare il pagamento.
                </small>
              </div>
              <Button
                size="sm"
                className="checkout-btn-gold fw-semibold px-3 border-0"
                onClick={() => setShowLoginBox(!showLoginBox)}
              >
                {showLoginBox ? "Chiudi" : "Accedi"}
              </Button>
            </div>

            {showLoginBox && (
              <Card className="checkout-box border-0 text-white mb-4 shadow-lg">
                <Card.Body className="p-4">
                  <h5 className="checkout-gold-title fw-bold mb-3">
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
                            className="checkout-input"
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
                            className="checkout-input"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} className="text-end mt-3">
                        <Button
                          type="submit"
                          size="sm"
                          className="checkout-btn-gold fw-semibold px-4 border-0"
                        >
                          Entra
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            )}

            <Card className="checkout-box border-0 text-white shadow-lg">
              <Card.Body className="p-4">
                <h4 className="checkout-main-title fs-3 fw-bold mb-4">
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
                          className="checkout-input"
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
                          className="checkout-input"
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
                      className="checkout-input"
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
                      className="checkout-input"
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
                          className="checkout-input"
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
                          className="checkout-input"
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
                          className="checkout-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    type="submit"
                    size="lg"
                    className="checkout-btn-gold w-100 py-3 fw-bold shadow border-0"
                  >
                    Conferma e Paga
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5}>
            <Card className="checkout-box checkout-sticky border-0 text-white shadow-lg">
              <Card.Body className="p-4">
                <h4 className="checkout-gold-title fw-bold mb-3">
                  Riepilogo Ordine
                </h4>

                {cart.length === 0 ? (
                  <p className="text-light opacity-75 small">
                    Il carrello è vuoto. Torna allo shop per aggiungere
                    prodotti.
                  </p>
                ) : (
                  <div className="checkout-cart-list mb-3">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25"
                      >
                        <span className="small text-light">{item.name}</span>
                        <span className="checkout-gold-text small fw-semibold">
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center fs-5 fw-bold">
                  <span>Totale:</span>
                  <span className="checkout-gold-text">€ {totalPrice}</span>
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
