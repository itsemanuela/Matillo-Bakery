import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import sfondoOrdini from "../assets/20210118_MAT_Presentazione concept_page-0011.jpg";

const API_URL = "http://localhost:3001/api";

const COLORE_STATO = {
  IN_ELABORAZIONE: "#D4C37E",
  PAGATO: "#7EA8A1",
  IN_PREPARAZIONE: "#829FB8",
  SPEDITO: "#A58FB8",
  CONSEGNATO: "#7EA885",
  CANCELLATO: "#C28C8C",
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23241d18'/%3E%3C/svg%3E";

function MyOrdini() {
  const [utenteLoggato, setUtenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  const [isRegistrazione, setIsRegistrazione] = useState(false);
  const [authData, setAuthData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });
  const [authErrore, setAuthErrore] = useState(null);
  const [authSuccesso, setAuthSuccesso] = useState(null);

  const [ordini, setOrdini] = useState([]);
  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState(null);

  const caricaMieiOrdini = (mostraCaricamento = true) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/ordini/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento dei tuoi ordini");
        return res.json();
      })
      .then((data) => {
        const ordinati = [...data].sort(
          (a, b) => new Date(b.dataOrdine) - new Date(a.dataOrdine),
        );
        setOrdini(ordinati);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    if (!utenteLoggato) return;
    caricaMieiOrdini(false);
  }, [utenteLoggato]);

  const handleAuthChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthErrore(null);
    setAuthSuccesso(null);

    // Registrazione punta a /utenti (come da UserController), login a /auth/login
    const endpoint = isRegistrazione ? "/utenti" : "/auth/login";

    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authData),
    })
      .then(async (res) => {
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = { message: text };
        }

        if (!res.ok) {
          throw new Error(
            data?.message ||
              (isRegistrazione
                ? "Errore durante la registrazione"
                : "Email o password non corretti"),
          );
        }
        return data;
      })
      .then((data) => {
        if (isRegistrazione) {
          setAuthSuccesso(
            "Registrazione completata! Ora puoi effettuare l'accesso.",
          );
          setIsRegistrazione(false);
          setAuthData({ nome: "", cognome: "", email: "", password: "" });
        } else {
          localStorage.setItem("token", data.token || data.accessToken);
          const utente = {
            uuid: data.uuid || data.id,
            nome: data.nome,
            email: data.email,
            ruolo: data.ruolo,
          };
          localStorage.setItem("utente", JSON.stringify(utente));
          setUtenteLoggato(utente);
        }
      })
      .catch((err) => setAuthErrore(err.message));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    setUtenteLoggato(null);
    setOrdini([]);
  };

  const formattaData = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        background: `linear-gradient(90deg, transparent 0%, transparent 55%, rgba(44,34,30,0.5) 75%, rgba(44,34,30,0.75) 100%), linear-gradient(160deg, rgba(58,43,35,0.55) 0%, rgba(44,34,30,0.65) 100%), url(${sfondoOrdini}) center center / cover no-repeat`,
        color: "#EFECE6",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "100px",
      }}
    >
      <style>{`
        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .ordine-card {
          animation: fadeInSlide 0.5s ease forwards;
          transition: all 0.3s ease;
        }
        .ordine-card:hover {
          transform: translateY(-3px);
          border-color: rgba(212, 195, 126, 0.25) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25) !important;
        }
        .checkout-input:focus {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: #D4C37E !important;
          color: #fff !important;
          box-shadow: 0 0 8px rgba(212, 195, 126, 0.15) !important;
        }
      `}</style>

      <Container style={{ maxWidth: "850px" }}>
        <div className="mb-4 text-start">
          <span
            className="text-uppercase fw-semibold"
            style={{
              color: "#D4C37E",
              fontSize: "11px",
              letterSpacing: "2.5px",
            }}
          >
            {utenteLoggato ? "Storico e Gestione" : "Autenticazione"}
          </span>
          <h1
            className="fw-bold text-white mt-1 display-5"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            {utenteLoggato
              ? "I Miei Ordini"
              : isRegistrazione
                ? "Crea un Account"
                : "Benvenuto in Matillo"}
          </h1>
          <div className="titolo-ordini-linea" />
        </div>

        {!utenteLoggato ? (
          <div
            className="p-5 shadow-lg mx-auto login-box-ricca"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              maxWidth: "440px",
              animation: "fadeInSlide 0.4s ease",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div className="login-box-filo-oro" />

            <div className="text-center mb-4">
              <div
                className="login-box-icona mb-2"
                style={{ color: "#D4C37E", fontSize: "24px" }}
              >
                <i
                  className={
                    isRegistrazione
                      ? "bi bi-person-plus-fill"
                      : "bi bi-lock-fill"
                  }
                ></i>
              </div>
              <h4
                className="text-white fw-bold mb-1"
                style={{ fontFamily: "'Roboto Serif', serif" }}
              >
                {isRegistrazione ? "Registrazione" : "Area Riservata"}
              </h4>
              <p className="small text-light opacity-75 mb-0">
                {isRegistrazione
                  ? "Inserisci i tuoi dati per registrarti"
                  : "Accedi per consultare i tuoi ordini"}
              </p>
            </div>

            {authErrore && (
              <Alert variant="danger" className="py-2 small">
                {authErrore}
              </Alert>
            )}
            {authSuccesso && (
              <Alert variant="success" className="py-2 small">
                {authSuccesso}
              </Alert>
            )}

            <Form onSubmit={handleAuthSubmit}>
              {isRegistrazione && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="small text-light opacity-75">
                      Nome
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={authData.nome}
                      onChange={handleAuthChange}
                      required
                      className="checkout-input bg-dark text-light border-secondary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="small text-light opacity-75">
                      Cognome
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="cognome"
                      value={authData.cognome}
                      onChange={handleAuthChange}
                      required
                      className="checkout-input bg-dark text-light border-secondary"
                    />
                  </Form.Group>
                </>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="small text-light opacity-75">
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={authData.email}
                  onChange={handleAuthChange}
                  required
                  className="checkout-input bg-dark text-light border-secondary"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small text-light opacity-75">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={authData.password}
                  onChange={handleAuthChange}
                  required
                  className="checkout-input bg-dark text-light border-secondary"
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100 fw-bold border-0 py-3 shadow-sm mb-3"
                style={{
                  backgroundColor: "#D4C37E",
                  color: "#1D1512",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                }}
              >
                {isRegistrazione ? "Registrati" : "Accedi ai tuoi ordini"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link text-decoration-none small p-0"
                  style={{ color: "#D4C37E" }}
                  onClick={() => {
                    setIsRegistrazione(!isRegistrazione);
                    setAuthErrore(null);
                    setAuthSuccesso(null);
                  }}
                >
                  {isRegistrazione
                    ? "Hai già un account? Accedi"
                    : "Non hai un account? Registrati"}
                </button>
              </div>
            </Form>
          </div>
        ) : (
          <>
            <div
              className="d-flex justify-content-between align-items-center mb-4 p-3 px-4 rounded-4"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                animation: "fadeInSlide 0.3s ease",
              }}
            >
              <span className="text-light opacity-75 d-flex align-items-center gap-2">
                <i
                  className="bi bi-person-fill"
                  style={{ color: "#D4C37E", fontSize: "16px" }}
                ></i>{" "}
                Benvenuto/a,{" "}
                <strong className="text-white fw-semibold">
                  {utenteLoggato.nome}
                </strong>
              </span>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleLogout}
                className="px-3 py-1 d-flex align-items-center gap-1 shadow-none"
                style={{
                  borderRadius: "8px",
                  borderColor: "rgba(255,255,255,0.15)",
                  fontSize: "13px",
                }}
              >
                <i className="bi bi-box-arrow-right"></i> Esci
              </Button>
            </div>

            {errore && <Alert variant="danger">{errore}</Alert>}

            {caricamento ? (
              <div className="text-center py-5">
                <Spinner
                  animation="border"
                  style={{
                    color: "#D4C37E",
                    width: "2.5rem",
                    height: "2.5rem",
                  }}
                />
              </div>
            ) : ordini.length === 0 ? (
              <div
                className="text-center py-5 p-4 rounded-4"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-light opacity-75 m-0">
                  Non hai ancora effettuato ordini nel nostro forno.
                </p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {ordini.map((ordine, index) => (
                  <Card
                    key={ordine.uuid}
                    className="ordine-card border-0 text-white"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.028)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "16px",
                      animationDelay: `${index * 0.08}s`,
                    }}
                  >
                    <Card.Body className="p-4">
                      <Row
                        className="align-items-center mb-3 pb-3"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <Col>
                          <span className="small text-light opacity-70">
                            {formattaData(ordine.dataOrdine)} ·{" "}
                            <span style={{ color: "#D4C37E" }}>
                              Ordine #{ordine.uuid.slice(0, 8)}
                            </span>
                          </span>
                        </Col>
                        <Col xs="auto">
                          <span
                            className="px-3 py-1 rounded-pill fw-semibold"
                            style={{
                              backgroundColor: `${COLORE_STATO[ordine.stato]}15`,
                              color: COLORE_STATO[ordine.stato] || "#EFECE6",
                              border: `1px solid ${COLORE_STATO[ordine.stato]}35`,
                              fontSize: "11px",
                              letterSpacing: "0.5px",
                            }}
                          >
                            {ordine.stato.replaceAll("_", " ")}
                          </span>
                        </Col>
                      </Row>

                      <div className="mb-3 d-flex flex-column gap-2">
                        {ordine.dettagli.map((d) => (
                          <div
                            key={d.uuid}
                            className="d-flex justify-content-between align-items-center text-light opacity-85 py-1"
                          >
                            <span className="d-flex align-items-center gap-3">
                              <img
                                src={d.prodotto.immagine || PLACEHOLDER_IMG}
                                alt={d.prodotto.nome}
                                className="riga-ordine-thumb"
                              />
                              <span>
                                <strong style={{ color: "#D4C37E" }}>
                                  {d.quantita}x
                                </strong>{" "}
                                {d.prodotto.nome}
                              </span>
                            </span>
                            <span className="text-white fw-medium">
                              € {(d.prezzoUnitario * d.quantita).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        className="d-flex justify-content-between align-items-center pt-3"
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span className="small text-light opacity-60 fst-italic d-flex align-items-center gap-1">
                          <i
                            className="bi bi-geo-alt-fill"
                            style={{ color: "#D4C37E", opacity: 0.8 }}
                          ></i>{" "}
                          {ordine.indirizzoSpedizione}
                        </span>
                        <div className="text-end">
                          <span className="small text-light opacity-50 me-2 d-none d-sm-inline">
                            Totale
                          </span>
                          <span
                            className="fw-bold fs-5"
                            style={{
                              color: "#D4C37E",
                              fontFamily: "'Roboto Serif', serif",
                            }}
                          >
                            € {ordine.totale.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default MyOrdini;
