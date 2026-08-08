import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import logoMatillo from "../assets/bgclear_transparent_original (2).png";

function MyNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [utente, setUtente] = useState(null);

  useEffect(() => {
    const utenteSalvato = localStorage.getItem("utente");
    if (utenteSalvato) {
      try {
        setUtente(JSON.parse(utenteSalvato));
      } catch (e) {
        setUtente(null);
      }
    } else {
      setUtente(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("utente");
    setUtente(null);
    navigate("/");
    window.location.reload();
  };

  const nomeUtente = utente?.nome
    ? utente.nome.charAt(0).toUpperCase() + utente.nome.slice(1)
    : "";
  const inizialeNome = utente?.nome ? utente.nome.charAt(0).toUpperCase() : "";

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="custom-navbar bg-transparent navbar-dark py-3"
    >
      <Container fluid className="px-4">
        {/* Logo a sinistra */}
        <Navbar.Brand as={Link} to="/" className="p-0">
          <img
            src={logoMatillo}
            alt="Antico Forno Matillo"
            height="45"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Spaziatore vuoto al centro per spingere tutto a destra */}
          <div className="me-auto"></div>

          {/* Blocco unico a destra: Link di navigazione + Area Utente / Accedi */}
          <Nav className="align-items-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/catering">
                Catering
              </Nav.Link>
              <Nav.Link as={Link} to="/laboratori">
                Laboratori
              </Nav.Link>
            </div>

            <div
              className="vr text-light opacity-50 d-none d-lg-block mx-2"
              style={{ height: "24px" }}
            ></div>

            {utente ? (
              <div className="d-flex align-items-center gap-3">
                {/* Profilo con cerchietto e nome */}
                <Link
                  to="/profilo"
                  className="text-decoration-none d-flex align-items-center gap-2 profile-pill px-2 py-1"
                >
                  <div className="avatar-circle-original">{inizialeNome}</div>
                  <span className="text-light small fw-medium">
                    {nomeUtente}
                  </span>
                </Link>

                {/* Tasto Esci */}
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-pill px-3"
                >
                  Esci
                </Button>
              </div>
            ) : (
              /* Tasto Accedi */
              <Link
                to="/accedi"
                className="btn btn-outline-light btn-sm rounded-pill px-3"
              >
                Accedi
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
