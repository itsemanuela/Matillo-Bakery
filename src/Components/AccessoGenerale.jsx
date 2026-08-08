import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const API_URL = "http://localhost:3001/api";

function AccessoGenerale() {
  const navigate = useNavigate();
  const [modalitaRegistrazione, setModalitaRegistrazione] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrore, setLoginErrore] = useState(null);

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

  const salvaSessione = (data) => {
    localStorage.setItem("token", data.token);
    const utente = {
      uuid: data.uuid,
      nome: data.nome,
      email: data.email,
      ruolo: data.ruolo,
    };
    localStorage.setItem("utente", JSON.stringify(utente));
    if (data.ruolo === "ADMIN") {
      navigate("/admin/prodotti");
    } else {
      navigate("/profilo");
    }
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
      .then(salvaSessione)
      .catch((err) => setLoginErrore(err.message));
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
      .then(salvaSessione)
      .catch((err) => setRegisterErrore(err.message))
      .finally(() => setRegistrazioneInCorso(false));
  };

  return (
    <div
      style={{
        background:
          "radial-gradient(circle at 15% 5%, rgba(238,217,114,0.1) 0%, transparent 45%), linear-gradient(160deg, #9c6b52 0%, #834F41 40%, #6d4838 75%, #573b2e 100%)",
        color: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <Container
        style={{ maxWidth: modalitaRegistrazione ? "640px" : "440px" }}
      >
        <style>{`
          .login-input-wrapper {
            position: relative;
          }
          .login-input-icona {
            position: absolute;
            top: 50%;
            left: 14px;
            transform: translateY(-50%);
            color: rgba(238, 217, 114, 0.7);
            font-size: 0.9rem;
            pointer-events: none;
            z-index: 2;
          }
          .login-input-con-icona {
            padding-left: 40px !important;
          }
        `}</style>
        <div
          className="p-4 p-md-5 position-relative overflow-hidden"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(238, 217, 114, 0.2)",
            borderRadius: "20px",
            boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
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
            }}
          />

          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "rgba(238, 217, 114, 0.12)",
              border: "1px solid rgba(238, 217, 114, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              color: "#EED972",
            }}
          >
            <i className="bi bi-lock-fill"></i>
          </div>

          <h2
            className="text-white fw-bold mb-1 text-center"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            {modalitaRegistrazione ? "Crea il tuo account" : "Accedi"}
          </h2>
          <p className="text-light opacity-75 small text-center mb-4">
            {modalitaRegistrazione
              ? "Registrati per ordinare e prenotare i nostri laboratori"
              : "Accedi per consultare i tuoi ordini e le tue prenotazioni"}
          </p>

          {!modalitaRegistrazione ? (
            <>
              {loginErrore && <Alert variant="danger">{loginErrore}</Alert>}
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <div className="login-input-wrapper">
                    <i className="bi bi-envelope-fill login-input-icona"></i>
                    <Form.Control
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className="checkout-input login-input-con-icona"
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Password</Form.Label>
                  <div className="login-input-wrapper">
                    <i className="bi bi-key-fill login-input-icona"></i>
                    <Form.Control
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="checkout-input login-input-con-icona"
                    />
                  </div>
                </Form.Group>
                <Button
                  type="submit"
                  className="w-100 fw-bold py-2 border-0"
                  style={{
                    backgroundColor: "#EED972",
                    color: "#221915",
                    borderRadius: "10px",
                  }}
                >
                  Accedi
                </Button>
              </Form>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-decoration-none small"
                  style={{ color: "#EED972" }}
                  onClick={() => {
                    setModalitaRegistrazione(true);
                    setLoginErrore(null);
                  }}
                >
                  Non hai un account? Registrati
                </Button>
              </div>
            </>
          ) : (
            <>
              {registerErrore && (
                <Alert variant="danger">{registerErrore}</Alert>
              )}
              <Form onSubmit={handleRegisterSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="small text-light">Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={registerData.nome}
                      onChange={handleRegisterChange}
                      required
                      className="checkout-input"
                    />
                  </Col>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small text-light">Email</Form.Label>
                    <div className="login-input-wrapper">
                      <i className="bi bi-envelope-fill login-input-icona"></i>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        className="checkout-input login-input-con-icona"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small text-light">
                      Password
                    </Form.Label>
                    <div className="login-input-wrapper">
                      <i className="bi bi-key-fill login-input-icona"></i>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        minLength={6}
                        required
                        className="checkout-input login-input-con-icona"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small text-light">Città</Form.Label>
                    <Form.Control
                      type="text"
                      name="città"
                      value={registerData.città}
                      onChange={handleRegisterChange}
                      required
                      className="checkout-input"
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small text-light">CAP</Form.Label>
                    <Form.Control
                      type="text"
                      name="cap"
                      value={registerData.cap}
                      onChange={handleRegisterChange}
                      required
                      className="checkout-input"
                    />
                  </Col>
                  <Col xs={12} className="mt-3">
                    <Button
                      type="submit"
                      disabled={registrazioneInCorso}
                      className="w-100 fw-bold py-2 border-0"
                      style={{
                        backgroundColor: "#EED972",
                        color: "#221915",
                        borderRadius: "10px",
                      }}
                    >
                      {registrazioneInCorso
                        ? "Creazione..."
                        : "Crea account e continua"}
                    </Button>
                  </Col>
                </Row>
              </Form>
              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-decoration-none small"
                  style={{ color: "#EED972" }}
                  onClick={() => {
                    setModalitaRegistrazione(false);
                    setRegisterErrore(null);
                  }}
                >
                  Hai già un account? Accedi
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AccessoGenerale;
