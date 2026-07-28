import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

function MyNavbar() {
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
            <Nav.Link href="#home" className="text-white fw-semibold">
              Home
            </Nav.Link>
            <Nav.Link href="#prodotti" className="text-white fw-semibold">
              Prodotti
            </Nav.Link>
            <Nav.Link href="#ricette" className="text-white fw-semibold">
              Ricette
            </Nav.Link>
            <Nav.Link href="#catering" className="text-white fw-semibold">
              Catering
            </Nav.Link>
            <Nav.Link href="#prodotti" className="text-white fw-semibold">
              Laboratori
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
