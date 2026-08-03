import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";

// Navbar dedicata al gestionale
function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    cursor: "pointer",
    color: location.pathname === path ? "#EED972" : "#f8f9fa",
    fontWeight: location.pathname === path ? 700 : 500,
  });

  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{ backgroundColor: "#1c1613" }}
      className="py-3"
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/admin/prodotti")}
          style={{
            cursor: "pointer",
            color: "#EED972",
            fontFamily: "'Roboto Serif', serif",
          }}
        >
          Gestionale · Matillo
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="admin-navbar-nav"
          className="border-0 shadow-none text-white"
        />

        <Navbar.Collapse id="admin-navbar-nav" className="justify-content-end">
          <Nav className="align-items-lg-center gap-lg-4">
            <Nav.Link
              onClick={() => navigate("/admin/prodotti")}
              style={linkStyle("/admin/prodotti")}
            >
              Prodotti
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/admin/ordini")}
              style={linkStyle("/admin/ordini")}
            >
              Ordini
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/admin/shop-preview")}
              style={linkStyle("/admin/shop-preview")}
            >
              Anteprima Shop
            </Nav.Link>

            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              style={{ borderRadius: "10px" }}
            >
              Esci
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
