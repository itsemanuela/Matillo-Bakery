import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:3001/api";

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

        console.log("Login riuscito:", data);
        navigate("/");
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
        color: "#f8f9fa",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        paddingTop: "80px",
        paddingBottom: "80px",
      }}
    >
      <Container style={{ maxWidth: "420px" }}>
        <div
          className="p-4 p-md-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.045)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
          }}
        >
          <h2
            className="text-white fw-bold mb-4 text-center"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Accedi al gestionale
          </h2>

          {errore && <Alert variant="danger">{errore}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={caricamento}
              className="w-100 fw-bold py-2"
              style={{
                backgroundColor: "#EED972",
                color: "#221915",
                border: "none",
                borderRadius: "10px",
              }}
            >
              {caricamento ? "Accesso in corso..." : "Accedi"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default Login;
