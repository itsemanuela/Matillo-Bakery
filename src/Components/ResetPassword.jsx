import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";

const API_URL = "http://localhost:3001/api";

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

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [nuovaPassword, setNuovaPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [errore, setErrore] = useState(null);
  const [successo, setSuccesso] = useState(false);
  const [invioInCorso, setInvioInCorso] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrore(null);

    if (!token) {
      setErrore("Link non valido: manca il token di reset.");
      return;
    }
    if (nuovaPassword.length < 6) {
      setErrore("La password deve avere almeno 6 caratteri.");
      return;
    }
    if (nuovaPassword !== confermaPassword) {
      setErrore("Le due password non coincidono.");
      return;
    }

    setInvioInCorso(true);

    fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, nuovaPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const testo = await res.text();
          throw new Error(
            testo || "Il link non è più valido, richiedine uno nuovo.",
          );
        }
        setSuccesso(true);
      })
      .catch((err) =>
        setErrore(
          err.message === "Failed to fetch"
            ? "Impossibile contattare il server. Controlla la connessione e riprova."
            : err.message,
        ),
      )
      .finally(() => setInvioInCorso(false));
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: "7rem 1.5rem 3rem",
        background:
          "radial-gradient(circle at 15% 10%, rgba(232,119,34,0.3) 0%, transparent 55%), linear-gradient(160deg, #1c1613 0%, #2b1f1a 35%, #8a3e1c 75%, #b34a14 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "440px" }}
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

          <h2
            className="fw-bold mb-1 text-center"
            style={{ fontFamily: "'Roboto Serif', serif", color: "#F4F1EA" }}
          >
            Scegli una nuova password
          </h2>
          <p
            className="opacity-75 small text-center mb-4"
            style={{ color: "#d9ccbc" }}
          >
            Deve avere almeno 6 caratteri.
          </p>

          {successo ? (
            <>
              <Alert variant="success">
                Password aggiornata! Ora puoi accedere con quella nuova.
              </Alert>
              <Button
                className="w-100 fw-bold py-2 border-0 shadow"
                style={{
                  backgroundColor: "#EED972",
                  color: "#1c1613",
                  borderRadius: "10px",
                }}
                onClick={() => navigate("/accedi")}
              >
                Vai al login
              </Button>
            </>
          ) : (
            <Form onSubmit={handleSubmit}>
              {errore && <Alert variant="danger">{errore}</Alert>}

              <Form.Group className="mb-3">
                <Form.Label
                  className="small fw-semibold"
                  style={{ color: "#F4F1EA" }}
                >
                  Nuova password
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text style={groupTextStyle}>
                    <i className="bi bi-key-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={nuovaPassword}
                    onChange={(e) => setNuovaPassword(e.target.value)}
                    required
                    style={inputControlStyle}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label
                  className="small fw-semibold"
                  style={{ color: "#F4F1EA" }}
                >
                  Conferma password
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text style={groupTextStyle}>
                    <i className="bi bi-key-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    value={confermaPassword}
                    onChange={(e) => setConfermaPassword(e.target.value)}
                    required
                    style={inputControlStyle}
                  />
                </InputGroup>
              </Form.Group>

              <Button
                type="submit"
                disabled={invioInCorso}
                className="w-100 fw-bold py-2 border-0 shadow"
                style={{
                  backgroundColor: "#EED972",
                  color: "#1c1613",
                  borderRadius: "10px",
                }}
              >
                {invioInCorso ? "Salvataggio..." : "Salva nuova password"}
              </Button>
            </Form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
