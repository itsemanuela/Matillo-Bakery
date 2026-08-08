import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

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

  const groupTextStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRight: "none",
    borderRadius: "12px 0 0 12px",
    color: "#4A3328",
  };

  const inputControlStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderLeft: "none",
    borderRadius: "0 12px 12px 0",
    color: "#221915",
  };

  return (
    <div
      style={{
        background: `
          radial-gradient(circle at 10% 15%, rgba(252, 211, 77, 0.35) 0%, transparent 40%),
          radial-gradient(circle at 90% 85%, rgba(217, 119, 6, 0.25) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(180, 100, 70, 0.5) 0%, transparent 70%),
          linear-gradient(135deg, #a46c52 0%, #7d4834 50%, #522d1f 100%)
        `,
        color: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "130px",
        paddingBottom: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(238, 217, 114, 0.15)",
          filter: "blur(80px)",
          borderRadius: "50%",
          top: "10%",
          left: "15%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          background: "rgba(140, 60, 40, 0.3)",
          filter: "blur(90px)",
          borderRadius: "50%",
          bottom: "5%",
          right: "10%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container
        style={{
          maxWidth: modalitaRegistrazione ? "640px" : "440px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="p-4 p-md-5 position-relative overflow-hidden"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.14)",
            backdropFilter: "blur(25px)",
            WebkitBackdropFilter: "blur(25px)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            borderTop: "1px solid rgba(255, 255, 255, 0.6)",
            borderRadius: "24px",
            boxShadow:
              "0 30px 60px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255, 235, 130, 0.9), transparent)",
            }}
          />
          <div
            style={{
              width: "64px",
              height: "64px",
              margin: "0 auto 16px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="#fde047"
              viewBox="0 0 16 16"
            >
              {modalitaRegistrazione ? (
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-7-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M8 9a3 3 0 0 0-3-3H2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h4.56A6.5 6.5 0 0 1 8 9" />
              ) : (
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              )}
            </svg>
          </div>

          <h2
            className="text-white fw-bold mb-1 text-center"
            style={{
              fontFamily: "'Roboto Serif', serif",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            {modalitaRegistrazione ? "Crea il tuo account" : "Accedi"}
          </h2>
          <p className="text-light opacity-85 small text-center mb-4">
            {modalitaRegistrazione
              ? "Registrati per ordinare e prenotare i nostri laboratori"
              : "Accedi per consultare i tuoi ordini e le tue prenotazioni"}
          </p>

          {!modalitaRegistrazione ? (
            <>
              {loginErrore && <Alert variant="danger">{loginErrore}</Alert>}
              <Form onSubmit={handleLoginSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-white small fw-semibold">
                    Email
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={groupTextStyle}>
                      <i className="bi bi-envelope-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      style={inputControlStyle}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white small fw-semibold">
                    Password
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text style={groupTextStyle}>
                      <i className="bi bi-key-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      style={inputControlStyle}
                    />
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 fw-bold py-2 border-0 shadow"
                  style={{
                    backgroundColor: "#fde047",
                    color: "#382316",
                    borderRadius: "12px",
                    transition: "all 0.2s ease",
                  }}
                >
                  Accedi
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  className="text-decoration-none small text-white fw-semibold"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                  onClick={() => {
                    setModalitaRegistrazione(true);
                    setLoginErrore(null);
                  }}
                >
                  Non hai un account?{" "}
                  <span style={{ color: "#fde047" }}>Registrati</span>
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
                    <Form.Label className="small text-white fw-semibold">
                      Nome
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-person-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={registerData.nome}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Cognome
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-person-badge-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="cognome"
                        value={registerData.cognome}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Email
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-envelope-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-key-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        minLength={6}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Telefono
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-telephone-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={registerData.telefono}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Indirizzo
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-geo-alt-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="indirizzo"
                        value={registerData.indirizzo}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      Città
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-building-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="città"
                        value={registerData.città}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col md={6}>
                    <Form.Label className="small text-white fw-semibold">
                      CAP
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text style={groupTextStyle}>
                        <i className="bi bi-mailbox-fill"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="cap"
                        value={registerData.cap}
                        onChange={handleRegisterChange}
                        required
                        style={inputControlStyle}
                      />
                    </InputGroup>
                  </Col>

                  <Col xs={12} className="mt-3">
                    <Button
                      type="submit"
                      disabled={registrazioneInCorso}
                      className="w-100 fw-bold py-2 border-0 shadow"
                      style={{
                        backgroundColor: "#fde047",
                        color: "#382316",
                        borderRadius: "12px",
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
                  className="text-decoration-none small text-white fw-semibold"
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                  onClick={() => {
                    setModalitaRegistrazione(false);
                    setRegisterErrore(null);
                  }}
                >
                  Hai già un account?{" "}
                  <span style={{ color: "#fde047" }}>Accedi</span>
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
