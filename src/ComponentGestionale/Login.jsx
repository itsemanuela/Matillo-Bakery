import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState(null);
  const [caricamento, setCaricamento] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrore(null);
    setCaricamento(true);

    fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Email o password non corretti");
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "utente",
          JSON.stringify({
            uuid: data.uuid,
            nome: data.nome,
            email: data.email,
            ruolo: data.ruolo,
          }),
        );

        if (data.ruolo !== "ADMIN") {
          localStorage.removeItem("token");
          localStorage.removeItem("utente");
          setErrore("Non hai i permessi per accedere a questa sezione.");
          return;
        }

        console.log("Login riuscito:", data);
        navigate("/admin/prodotti");
      })
      .catch((err) => {
        setErrore(err.message);
      })
      .finally(() => setCaricamento(false));
  };

  return (
    <div
      style={{
        backgroundColor: "#221915",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, #352620 0%, #221915 80%)",
        color: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .login-box {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(238, 217, 114, 0.2);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }

        .login-box::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #EED972, transparent);
        }

        .login-input {
          background-color: rgba(255, 255, 255, 0.05) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          padding: 0.8rem 1rem !important;
          transition: all 0.2s ease;
        }

        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        .login-input:focus {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: #EED972 !important;
          box-shadow: 0 0 0 4px rgba(238, 217, 114, 0.15) !important;
        }

        .btn-gold {
          background-color: #EED972 !important;
          color: #221915 !important;
          border: none !important;
          border-radius: 12px !important;
          font-weight: 700;
          padding: 0.8rem 1rem;
          transition: all 0.2s ease;
        }

        .btn-gold:hover {
          background-color: #f3e28c !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(238, 217, 114, 0.3);
        }
      `}</style>

      <Container style={{ maxWidth: "900px" }}>
        <Row className="align-items-center g-5">
          <Col lg={6} className="text-center text-lg-start d-none d-lg-block">
            <span
              style={{
                color: "#EED972",
                letterSpacing: "4px",
                textTransform: "uppercase",
                fontSize: "0.8rem",
                fontWeight: 600,
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Antico Forno Matillo • Dal 1943
            </span>
            <h1
              className="fw-bold mb-3"
              style={{
                fontFamily: "'Roboto Serif', serif",
                fontSize: "2.8rem",
                lineHeight: "1.2",
                color: "#ffffff",
              }}
            >
              Pannello di <br />
              <span style={{ color: "#EED972" }}>Amministrazione</span>
            </h1>
            <p
              className="text-light opacity-75 mb-4"
              style={{ fontSize: "1.05rem", lineHeight: "1.6" }}
            >
              Accedi per monitorare gli ordini in arrivo, aggiornare il catalogo
              prodotti e gestire le attività quotidiane del forno.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-lg-start text-light opacity-50 small">
              <span>✦ Ordini</span>
              <span>✦ Prodotti</span>
              <span>✦ Magazzino</span>
            </div>
          </Col>

          <Col lg={6}>
            <div className="login-box p-4 p-md-5">
              <div className="text-center mb-4">
                <span
                  className="d-lg-none"
                  style={{
                    color: "#EED972",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Antico Forno Matillo
                </span>
                <h2
                  className="text-white fw-bold mb-2"
                  style={{
                    fontFamily: "'Roboto Serif', serif",
                    fontSize: "1.8rem",
                  }}
                >
                  Accedi al gestionale
                </h2>
                <p className="text-light opacity-75 small">
                  Inserisci le tue credenziali di accesso
                </p>
              </div>

              {errore && (
                <Alert
                  variant="danger"
                  onClose={() => setErrore(null)}
                  dismissible
                  className="border-0 shadow-sm mb-4"
                >
                  {errore}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-light opacity-85">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="nome@esempio.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold text-light opacity-85">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={caricamento}
                  className="w-100 btn-gold"
                >
                  {caricamento ? (
                    <Spinner
                      animation="border"
                      size="sm"
                      style={{ color: "#221915" }}
                    />
                  ) : (
                    "Accedi"
                  )}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
