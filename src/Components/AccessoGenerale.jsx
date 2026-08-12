import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import accessoImg from "../assets/lavorazione/PEPP5272.jpg";

const API_URL = "http://localhost:3001/api";

const emberParticles = [
  { left: "10%", size: 5, delay: 0, duration: 6 },
  { left: "28%", size: 4, delay: 1.2, duration: 7 },
  { left: "50%", size: 6, delay: 0.5, duration: 6.5 },
  { left: "70%", size: 4, delay: 1.8, duration: 7.5 },
  { left: "88%", size: 5, delay: 0.9, duration: 6.8 },
];

const groupTextStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRight: "none",
  borderRadius: "10px 0 0 10px",
  color: "#EED972",
};

const inputControlStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderLeft: "none",
  borderRadius: "0 10px 10px 0",
  color: "#F4F1EA",
};

function AccessoGenerale() {
  const navigate = useNavigate();
  const [modalitaRegistrazione, setModalitaRegistrazione] = useState(false);
  const [modalitaReset, setModalitaReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetInviato, setResetInviato] = useState(false);
  const [resetErrore, setResetErrore] = useState(null);
  const [resetInCorso, setResetInCorso] = useState(false);

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

  const handleRichiediReset = (e) => {
    e.preventDefault();
    setResetErrore(null);
    setResetInCorso(true);

    fetch(`${API_URL}/auth/richiedi-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Si è verificato un errore, riprova più tardi.");
        setResetInviato(true);
      })
      .catch((err) => setResetErrore(err.message))
      .finally(() => setResetInCorso(false));
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
      className="accesso-split"
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        background:
          "radial-gradient(circle at 15% 10%, rgba(232,119,34,0.3) 0%, transparent 55%), linear-gradient(160deg, #1c1613 0%, #2b1f1a 35%, #8a3e1c 75%, #b34a14 100%)",
      }}
    >
      <style>{`
        @media (max-width: 991.98px) {
          .accesso-split { flex-direction: column; }
          .accesso-image { flex: 0 0 auto !important; height: 200px; }
          .accesso-image .accesso-numeral { font-size: 6rem !important; top: -1rem !important; }
          .accesso-image .accesso-tagline { font-size: 1.4rem !important; }
          .accesso-image .accesso-subtext { display: none; }
          .accesso-form-wrap { padding: 2rem 1.25rem !important; }
        }
      `}</style>

      <div
        className="accesso-image"
        style={{
          flex: "0 0 44%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={accessoImg}
          alt="Forno acceso dell'Antico Forno Matillo"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter:
              "sepia(0.2) saturate(1.3) hue-rotate(-8deg) contrast(1.08) brightness(0.75)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, rgba(20,14,11,0.95) 0%, rgba(20,14,11,0.55) 45%, rgba(20,14,11,0.25) 100%)",
          }}
        />
        <span
          aria-hidden="true"
          className="accesso-numeral"
          style={{
            position: "absolute",
            top: "-2rem",
            left: "-1rem",
            fontFamily: "'Roboto Serif', serif",
            fontWeight: 700,
            fontSize: "16rem",
            lineHeight: 1,
            color: "#EED972",
            opacity: 0.1,
            userSelect: "none",
          }}
        >
          1943
        </span>

        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "1.5rem",
            right: "1.5rem",
          }}
        >
          <span
            className="d-block mb-2 accesso-tagline"
            style={{
              fontFamily: "'Allura', cursive",
              fontSize: "2.2rem",
              color: "#EED972",
              lineHeight: 1,
            }}
          >
            Bentornato tra i profumi del forno
          </span>
          <p
            className="mb-0 accesso-subtext"
            style={{ color: "#d9ccbc", fontSize: "0.95rem", maxWidth: "360px" }}
          >
            Accedi per ritrovare i tuoi ordini, le prenotazioni ai laboratori e
            i sapori di sempre.
          </p>
        </div>
      </div>

      <div
        className="position-relative d-flex align-items-center justify-content-center accesso-form-wrap"
        style={{ flex: "1", padding: "7rem 1.5rem 3rem" }}
      >
        {emberParticles.map((p, i) => (
          <motion.span
            key={i}
            className="position-absolute d-none d-md-block"
            style={{
              left: p.left,
              bottom: "8%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: "50%",
              backgroundColor: "#EED972",
              boxShadow: "0 0 8px 2px rgba(238,217,114,0.8)",
              pointerEvents: "none",
              zIndex: 0,
            }}
            animate={{
              y: [0, -260],
              x: [0, 12, -8, 4],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="position-relative"
          style={{
            width: "100%",
            maxWidth: modalitaRegistrazione ? "640px" : "440px",
            zIndex: 1,
          }}
        >
          <div
            className="p-4 p-md-5 position-relative overflow-hidden"
            style={{
              backgroundColor: "rgba(28, 22, 19, 0.72)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              border: "1px solid rgba(238,217,114,0.2)",
              borderRadius: "6px",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.5)",
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

            {!modalitaReset && (
              <div
                className="d-flex mx-auto mb-4"
                style={{
                  width: "fit-content",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(238,217,114,0.25)",
                  borderRadius: "999px",
                  padding: "4px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setModalitaRegistrazione(false);
                    setLoginErrore(null);
                  }}
                  className="border-0 fw-semibold px-4 py-2"
                  style={{
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    backgroundColor: !modalitaRegistrazione
                      ? "#EED972"
                      : "transparent",
                    color: !modalitaRegistrazione ? "#1c1613" : "#d9ccbc",
                    transition: "all 0.2s ease",
                  }}
                >
                  Accedi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalitaRegistrazione(true);
                    setRegisterErrore(null);
                  }}
                  className="border-0 fw-semibold px-4 py-2"
                  style={{
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    backgroundColor: modalitaRegistrazione
                      ? "#EED972"
                      : "transparent",
                    color: modalitaRegistrazione ? "#1c1613" : "#d9ccbc",
                    transition: "all 0.2s ease",
                  }}
                >
                  Registrati
                </button>
              </div>
            )}

            <h2
              className="fw-bold mb-1 text-center"
              style={{
                fontFamily: "'Roboto Serif', serif",
                color: "#F4F1EA",
              }}
            >
              {modalitaReset
                ? "Reimposta la password"
                : modalitaRegistrazione
                  ? "Crea il tuo account"
                  : "Bentornato"}
            </h2>
            <p
              className="opacity-75 small text-center mb-4"
              style={{ color: "#d9ccbc" }}
            >
              {modalitaReset
                ? "Inserisci l'email del tuo account: riceverai un link per scegliere una nuova password."
                : modalitaRegistrazione
                  ? "Registrati per ordinare e prenotare i nostri laboratori"
                  : "Accedi per consultare i tuoi ordini e le tue prenotazioni"}
            </p>

            {modalitaReset ? (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                {resetInviato ? (
                  <Alert variant="success">
                    Se l'email è registrata, riceverai a breve un link per
                    reimpostare la password.
                  </Alert>
                ) : (
                  <>
                    {resetErrore && (
                      <Alert variant="danger">{resetErrore}</Alert>
                    )}
                    <Form onSubmit={handleRichiediReset}>
                      <Form.Group className="mb-4">
                        <Form.Label
                          className="small fw-semibold"
                          style={{ color: "#F4F1EA" }}
                        >
                          Email
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text style={groupTextStyle}>
                            <i className="bi bi-envelope-fill"></i>
                          </InputGroup.Text>
                          <Form.Control
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            style={inputControlStyle}
                          />
                        </InputGroup>
                      </Form.Group>
                      <Button
                        type="submit"
                        disabled={resetInCorso}
                        className="w-100 fw-bold py-2 border-0 shadow"
                        style={{
                          backgroundColor: "#EED972",
                          color: "#1c1613",
                          borderRadius: "10px",
                        }}
                      >
                        {resetInCorso
                          ? "Invio in corso..."
                          : "Invia link di reset"}
                      </Button>
                    </Form>
                  </>
                )}
                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    className="text-decoration-none small text-white fw-semibold"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                    onClick={() => {
                      setModalitaReset(false);
                      setResetInviato(false);
                      setResetErrore(null);
                      setResetEmail("");
                    }}
                  >
                    <span style={{ color: "#EED972" }}>← Torna al login</span>
                  </Button>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {!modalitaRegistrazione ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {loginErrore && (
                      <Alert variant="danger">{loginErrore}</Alert>
                    )}
                    <Form onSubmit={handleLoginSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label
                          className="small fw-semibold"
                          style={{ color: "#F4F1EA" }}
                        >
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

                      <Form.Group className="mb-2">
                        <Form.Label
                          className="small fw-semibold"
                          style={{ color: "#F4F1EA" }}
                        >
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

                      <div className="text-end mb-4">
                        <Button
                          variant="link"
                          className="text-decoration-none small p-0"
                          onClick={() => {
                            setModalitaReset(true);
                            setLoginErrore(null);
                          }}
                          style={{ color: "#d9ccbc" }}
                        >
                          Password dimenticata?
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        className="w-100 fw-bold py-2 border-0 shadow"
                        style={{
                          backgroundColor: "#EED972",
                          color: "#1c1613",
                          borderRadius: "10px",
                        }}
                      >
                        Accedi
                      </Button>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {registerErrore && (
                      <Alert variant="danger">{registerErrore}</Alert>
                    )}
                    <Form onSubmit={handleRegisterSubmit}>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                          <Form.Label
                            className="small fw-semibold"
                            style={{ color: "#F4F1EA" }}
                          >
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
                              backgroundColor: "#EED972",
                              color: "#1c1613",
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
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AccessoGenerale;
