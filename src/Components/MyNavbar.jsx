import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useNavigate } from "react-router-dom";

function MyNavbar() {
  const navigate = useNavigate();
  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="py-0"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
        minHeight: "95px",
      }}
    >
      <Container fluid className="px-4 position-relative">
        <Navbar.Brand
          href="#home"
          className="d-flex align-items-center m-0 p-0"
          style={{ position: "absolute", left: "20px", top: "-10px" }}
        >
          <img
            src=" src\assets\bgclear_transparent_original (2).png"
            alt="Antico Forno Matillo"
            style={{
              height: "90px",
              width: "auto",
              mixBlendMode: "screen",
              display: "block",
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="ms-auto text-white"
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3 py-2" style={{ paddingLeft: "140px" }}>
            <Nav.Link
              onClick={() => navigate("/")}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/prodotti")}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Shop
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/ricette")}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Ricette
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/catering")}
              className="text-white"
              style={{ cursor: "pointer" }}
            >
              Catering
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/laboratori")}
              className="text-white"
              style={{ cursor: "pointer" }}
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
