import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import FormCity from "./FormCity";

const API_URL = "http://localhost:3001/api";
const CODICE_SCONTO_VALIDO = "BENVENUTO10";
const PERCENTUALE_SCONTO = 0.1;

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, totalPrice } = location.state || {
    cart: [],
    totalPrice: "0.00",
  };

  const [showLoginBox, setShowLoginBox] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrore, setLoginErrore] = useState(null);

  const [showRegisterBox, setShowRegisterBox] = useState(false);
  const [registerData, setRegisterData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    telefono: "",
    indirizzo: "",
    città: "",
    cap: "",
  });
  const [registerErrore, setRegisterErrore] = useState(null);
  const [registrazioneInCorso, setRegistrazioneInCorso] = useState(false);

  const [utenteLoggato, setUtenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  const [shippingData, setShippingData] = useState({
    nome: "",
    cognome: "",
    email: "",
    indirizzo: "",
    citta: "",
    cap: "",
    telefono: "",
  });

  const [codiceSconto, setCodiceSconto] = useState("");
  const [scontoApplicato, setScontoApplicato] = useState(false);
  const [scontoErrore, setScontoErrore] = useState(null);

  const [errore, setErrore] = useState(null);
  const [invioInCorso, setInvioInCorso] = useState(false);
  const [ordineCompletato, setOrdineCompletato] = useState(false);

  const subtotale = parseFloat(totalPrice) || 0;
  const valoreSconto = scontoApplicato ? subtotale * PERCENTUALE_SCONTO : 0;
  const totaleFinale = (subtotale - valoreSconto).toFixed(2);

  const handleApplicaSconto = (e) => {
    e.preventDefault();
    setScontoErrore(null);

    if (utenteLoggato) {
      setScontoErrore(
        "Questo codice è riservato ai nuovi clienti senza account.",
      );
      return;
    }

    if (codiceSconto.trim().toUpperCase() === CODICE_SCONTO_VALIDO) {
      setScontoApplicato(true);
    } else {
      setScontoApplicato(false);
      setScontoErrore("Codice sconto non valido.");
    }
  };

  const handleShippingChange = (e) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginErrore(null);

    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Email o password non corretti");
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        const utente = {
          uuid: data.uuid,
          nome: data.nome,
          email: data.email,
          ruolo: data.ruolo,
        };
        localStorage.setItem("utente", JSON.stringify(utente));
        setUtenteLoggato(utente);
        setShowLoginBox(false);
      })
      .catch((err) => setLoginErrore(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    setUtenteLoggato(null);
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegisterErrore(null);
    setRegistrazioneInCorso(true);

    fetch(`${API_URL}/utenti`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            const primoErrore = err.validationErrors
              ? Object.values(err.validationErrors)[0]
              : err.message;
            throw new Error(primoErrore || "Errore durante la registrazione");
          });
        }
        return res.json();
      })
      .then(() =>
        fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
          }),
        }),
      )
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        const utente = {
          uuid: data.uuid,
          nome: data.nome,
          email: data.email,
          ruolo: data.ruolo,
        };
        localStorage.setItem("utente", JSON.stringify(utente));
        setUtenteLoggato(utente);
        setShowRegisterBox(false);
        setShowLoginBox(false);
      })
      .catch((err) => setRegisterErrore(err.message))
      .finally(() => setRegistrazioneInCorso(false));
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setErrore(null);
    setInvioInCorso(true);

    if (!scontoApplicato) {
      proseguiConInvio();
      return;
    }

    fetch(
      `${API_URL}/utenti/esiste?email=${encodeURIComponent(shippingData.email)}`,
    )
      .then((res) => (res.ok ? res.json() : false))
      .then((emailGiaRegistrata) => {
        if (emailGiaRegistrata) {
          setScontoApplicato(false);
          setErrore(
            "L'email inserita appartiene già a un account: il codice sconto di benvenuto non è valido, accedi per procedere.",
          );
          setInvioInCorso(false);
          return;
        }
        proseguiConInvio(true);
      })
      .catch(() => {
        // Se il controllo fallisce per un problema di rete, procediamo
        // comunque senza sconto invece di bloccare l'intero checkout.
        setScontoApplicato(false);
        proseguiConInvio(false);
      });
  };

  const proseguiConInvio = (conSconto = scontoApplicato) => {
    const dettagli = Object.values(
      cart.reduce((acc, item) => {
        if (!acc[item.uuid]) {
          acc[item.uuid] = { idProdotto: item.uuid, quantita: 0 };
        }
        acc[item.uuid].quantita += 1;
        return acc;
      }, {}),
    );

    const indirizzoCompleto = `${shippingData.indirizzo}, ${shippingData.citta} ${shippingData.cap}`;

    const noteConSconto = conSconto
      ? `Codice sconto applicato: ${CODICE_SCONTO_VALIDO} (-10%)`
      : "";

    const payload = {
      indirizzoSpedizione: indirizzoCompleto,
      note: noteConSconto,
      dettagli,
      nomeCliente: shippingData.nome,
      cognomeCliente: shippingData.cognome,
      emailCliente: shippingData.email,
      telefonoCliente: shippingData.telefono,
    };

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    fetch(`${API_URL}/ordini`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(
              err.message || "Errore durante l'invio dell'ordine",
            );
          });
        }
        return res.json();
      })
      .then((ordineCreato) => {
        return fetch(
          `${API_URL}/pagamenti/crea-sessione/${ordineCreato.uuid}`,
          {
            method: "POST",
          },
        )
          .then((res) => {
            if (!res.ok)
              throw new Error("Impossibile aprire il pagamento, riprova.");
            return res.json();
          })
          .then((sessione) => {
            window.location.href = sessione.url;
          });
      })
      .catch((err) => {
        setErrore(err.message);
        setInvioInCorso(false);
      });
  };

  return (
    <div className="checkout-page-wrapper">
      <style>{`
        @media (max-width: 991.98px) {
          .checkout-sticky {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
      <Container className="checkout-container">
        <div className="text-center mb-5">
          <span className="checkout-subtitle">Antico Forno Matillo 1943</span>
          <h1 className="checkout-main-title">Checkout</h1>
          {!ordineCompletato && (
            <p className="text-light opacity-75">
              Verifica il tuo carrello e completa i dati per la spedizione.
            </p>
          )}
        </div>

        {ordineCompletato ? (
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
                Ordine ricevuto!
              </h4>
              <p className="checkout-text-muted mb-4">
                Grazie per aver scelto Antico Forno Matillo. Ti abbiamo mandato
                una conferma via email a {shippingData.email}.
              </p>
              <p className="checkout-text-muted small mb-4">
                Per consultare lo stato dei tuoi ordini in futuro, ti
                consigliamo di creare un account: potrai ritrovarli tutti nella
                sezione "I miei ordini".
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  className="checkout-btn-gold fw-semibold px-4 border-0"
                  onClick={() => navigate("/shop")}
                >
                  Torna allo Shop
                </Button>
                <Button
                  variant="outline-light"
                  className="fw-semibold px-4"
                  onClick={() => navigate("/accedi")}
                >
                  Crea un account
                </Button>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            <Col lg={7} className="order-2 order-lg-1">
              {errore && <Alert variant="danger">{errore}</Alert>}

              <div className="checkout-box p-4 mb-4 shadow-sm d-flex justify-content-between align-items-center gap-2">
                <div>
                  {utenteLoggato ? (
                    <>
                      <h6 className="mb-0 text-white fw-bold">
                        Ciao, {utenteLoggato.nome}
                      </h6>
                      <small className="checkout-text-muted">
                        Sei collegato al tuo account.
                      </small>
                    </>
                  ) : (
                    <>
                      <h6 className="mb-0 text-white fw-bold">
                        Hai già un account?
                      </h6>
                      <small className="checkout-text-muted">
                        Accedi per velocizzare il pagamento, oppure continua
                        come ospite.
                      </small>
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  className="checkout-btn-gold fw-semibold px-3 border-0"
                  onClick={
                    utenteLoggato
                      ? handleLogout
                      : () => setShowLoginBox(!showLoginBox)
                  }
                >
                  {utenteLoggato ? "Esci" : showLoginBox ? "Chiudi" : "Accedi"}
                </Button>
              </div>

              {showLoginBox && !utenteLoggato && (
                <Card className="checkout-box border-0 text-white mb-4 shadow-lg">
                  <Card.Body className="p-4">
                    <h5 className="checkout-gold-title fw-bold mb-3">
                      Accedi al tuo profilo
                    </h5>
                    {loginErrore && (
                      <Alert variant="danger">{loginErrore}</Alert>
                    )}
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
                        <Col
                          xs={12}
                          className="d-flex justify-content-between align-items-center mt-3"
                        >
                          <Button
                            variant="link"
                            className="p-0 text-decoration-none small"
                            style={{ color: "#EED972" }}
                            onClick={() => {
                              setShowRegisterBox(!showRegisterBox);
                              setRegisterErrore(null);
                            }}
                          >
                            Non hai un account? Registrati
                          </Button>
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

              {showRegisterBox && !utenteLoggato && (
                <Card className="checkout-box border-0 text-white mb-4 shadow-lg">
                  <Card.Body className="p-4">
                    <h5 className="checkout-gold-title fw-bold mb-3">
                      Crea un account
                    </h5>
                    {registerErrore && (
                      <Alert variant="danger">{registerErrore}</Alert>
                    )}
                    <Form onSubmit={handleRegisterSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Nome
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="nome"
                              value={registerData.nome}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Cognome
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="cognome"
                              value={registerData.cognome}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Email
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              value={registerData.email}
                              onChange={handleRegisterChange}
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
                              value={registerData.password}
                              onChange={handleRegisterChange}
                              minLength={6}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Telefono
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="telefono"
                              value={registerData.telefono}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Indirizzo
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="indirizzo"
                              value={registerData.indirizzo}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              Città
                            </Form.Label>
                            <FormCity
                              name="città"
                              value={registerData.città}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small text-light">
                              CAP
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="cap"
                              value={registerData.cap}
                              onChange={handleRegisterChange}
                              required
                              className="checkout-input"
                            />
                          </Form.Group>
                        </Col>
                        <Col xs={12} className="text-end mt-3">
                          <Button
                            type="submit"
                            size="sm"
                            disabled={registrazioneInCorso}
                            className="checkout-btn-gold fw-semibold px-4 border-0"
                          >
                            {registrazioneInCorso
                              ? "Creazione..."
                              : "Crea account e continua"}
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
                          <FormCity
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
                            Telefono *
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono"
                            value={shippingData.telefono}
                            onChange={handleShippingChange}
                            required
                            className="checkout-input"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={invioInCorso || cart.length === 0}
                      className="checkout-btn-gold w-100 py-3 fw-bold shadow border-0"
                    >
                      {invioInCorso ? "Invio in corso..." : "Conferma e Paga"}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={5} className="order-1 order-lg-2">
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
                          <span className="small text-light">{item.nome}</span>
                          <span className="checkout-gold-text small fw-semibold">
                            € {item.prezzo.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && !utenteLoggato && (
                    <div className="mb-3">
                      <Form onSubmit={handleApplicaSconto}>
                        <Form.Label className="small text-light mb-2">
                          Hai un codice sconto?
                        </Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Control
                            type="text"
                            placeholder="Es. BENVENUTO10"
                            value={codiceSconto}
                            onChange={(e) => setCodiceSconto(e.target.value)}
                            className="checkout-input"
                            disabled={scontoApplicato}
                          />
                          <Button
                            type="submit"
                            className="checkout-btn-gold fw-semibold px-3 border-0"
                            disabled={scontoApplicato || !codiceSconto.trim()}
                          >
                            {scontoApplicato ? (
                              <i className="bi bi-check2"></i>
                            ) : (
                              "Applica"
                            )}
                          </Button>
                        </div>
                      </Form>
                      {scontoErrore && (
                        <small
                          className="d-block mt-2"
                          style={{ color: "#e08585" }}
                        >
                          {scontoErrore}
                        </small>
                      )}
                      {scontoApplicato && (
                        <small className="d-block mt-2 checkout-gold-text">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          Sconto del 10% applicato
                        </small>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-top border-secondary border-opacity-25">
                    {scontoApplicato && (
                      <>
                        <div className="d-flex justify-content-between small text-light opacity-75 mb-1">
                          <span>Subtotale:</span>
                          <span>€ {subtotale.toFixed(2)}</span>
                        </div>
                        <div
                          className="d-flex justify-content-between small mb-2"
                          style={{ color: "#8fd19e" }}
                        >
                          <span>Sconto (10%):</span>
                          <span>- € {valoreSconto.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    <div className="d-flex justify-content-between align-items-center fs-5 fw-bold">
                      <span>Totale:</span>
                      <span className="checkout-gold-text">
                        € {totaleFinale}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Checkout;
