import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/bgclear_transparent_original (2).png";

function MyNavbar() {
  const navigate = useNavigate();

  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "transparent",
        zIndex: 1000,
      }}
      className="py-3"
    >
      <Container className="d-flex justify-content-between align-items-center">
        <Navbar.Brand
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={logoImg}
            alt="Antico Forno Matillo"
            style={{ height: "65px" }}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="border-0 shadow-none text-white"
        />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav
            className="align-items-lg-center gap-lg-4 text-center p-3 p-lg-0 mt-3 mt-lg-0 rounded"
            style={{
              backgroundColor: "transparent",
            }}
          >
            <Nav.Link
              onClick={() => navigate("/")}
              className="text-white fw-semibold"
              style={{
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/shop")}
              className="text-white fw-semibold"
              style={{
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              Shop
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/ricette")}
              className="text-white fw-semibold"
              style={{
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              Ricette
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/catering")}
              className="text-white fw-semibold"
              style={{
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              Catering
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/laboratori")}
              className="text-white fw-semibold"
              style={{
                cursor: "pointer",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              Laboratori
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
