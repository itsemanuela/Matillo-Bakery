import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useNavigate } from "react-router-dom";

import fetteBiscottateImg from "../assets/20210118_MAT_Presentazione concept_page-0008.jpg";

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("tutti");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  const products = [
    {
      id: 1,
      name: "Crostata Artigianale",
      category: "dolci",
      description:
        "Fatta in casa con pasta frolla burrosa e confettura extra di frutta di stagione.",
      price: "€ 14,00",
      rawPrice: 14.0,
      image: fetteBiscottateImg,
    },
    {
      id: 2,
      name: "Brioches Soffici",
      category: "dolci",
      description:
        "Soffice impasto lievitato naturalmente, profumato alla vaniglia e agrumi.",
      price: "€ 2,50",
      rawPrice: 2.5,
      image: fetteBiscottateImg,
    },
    {
      id: 3,
      name: "Zeppole Tradizionali",
      category: "dolci",
      description:
        "Friabili fuori e morbide dentro, guarnite con crema pasticcera e amarene.",
      price: "€ 3,00",
      rawPrice: 3.0,
      image: fetteBiscottateImg,
    },
    {
      id: 4,
      name: "Pizza in Teglia alla Romana",
      category: "pizze",
      description:
        "Alta idratazione, alveolatura perfetta, croccante e condita con pomodoro e basilico.",
      price: "€ 4,50",
      rawPrice: 4.5,
      image: fetteBiscottateImg,
    },
    {
      id: 5,
      name: "Focaccia Genovese Classica",
      category: "pizze",
      description:
        "Morbida, alta, condita con olio extravergine d'oliva e fior di sale.",
      price: "€ 3,80",
      rawPrice: 3.8,
      image: fetteBiscottateImg,
    },
    {
      id: 6,
      name: "Pagnotta di Grano Duro",
      category: "pane",
      description:
        "Lievitazione naturale con pasta madre, crosta croccante e mollica dorata.",
      price: "€ 4,00",
      rawPrice: 4.0,
      image: fetteBiscottateImg,
    },
    {
      id: 7,
      name: "Pane ai Cereali e Semi",
      category: "pane",
      description:
        "Ricco di semi misti e farine macinate a pietra, rustico e nutriente.",
      price: "€ 4,50",
      rawPrice: 4.5,
      image: fetteBiscottateImg,
    },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const totalPrice = cart
    .reduce((sum, item) => sum + item.rawPrice, 0)
    .toFixed(2);

  const filteredProducts =
    selectedCategory === "tutti"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div
      style={{
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "120px",
        position: "relative",
      }}
    >
      {/* --- PANNELLO LATERALE CARRELLO (OFFCANVAS) --- */}
      <Offcanvas
        show={showCart}
        onHide={handleCloseCart}
        placement="end"
        style={{ backgroundColor: "#2d231e", color: "#fff" }}
      >
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          className="border-bottom border-secondary border-opacity-25"
        >
          <Offcanvas.Title
            className="fw-bold"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Il tuo Carrello artigianale
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {cart.length === 0 ? (
            <div className="text-center my-auto text-light opacity-75">
              <p className="fs-1 mb-3" style={{ color: "#EED972" }}>
                <i className="bi bi-bag"></i>
              </p>
              <p className="fs-5 mb-1">Il carrello è vuoto.</p>
              <small>
                Aggiungi i tuoi prodotti preferiti dal nostro forno!
              </small>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-25"
                  >
                    <div>
                      <h6 className="mb-0 fw-bold">{item.name}</h6>
                      <small style={{ color: "#EED972" }}>{item.price}</small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(index)}
                      style={{ fontSize: "0.8rem", padding: "2px 8px" }}
                    >
                      Rimuovi
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-top border-secondary border-opacity-25 mt-auto">
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3">
                  <span>Totale:</span>
                  <span style={{ color: "#EED972" }}>€ {totalPrice}</span>
                </div>
                <Button
                  className="w-100 py-3 fw-bold shadow border-0"
                  style={{ backgroundColor: "#EED972", color: "#221915" }}
                  onClick={() => {
                    handleCloseCart();
                    navigate("/checkout", { state: { cart, totalPrice } });
                  }}
                >
                  Procedi al Checkout
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* --- BARRA INFERIORE A COMPARSA --- */}
      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "rgba(34, 25, 21, 0.95)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(238, 217, 114, 0.4)",
            padding: "15px 30px",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <span className="fs-4" style={{ color: "#EED972" }}>
              <i className="bi bi-cart3"></i>
            </span>
            <div>
              <span className="text-white fw-bold me-2">
                {cart.length} {cart.length === 1 ? "prodotto" : "prodotti"} nel
                carrello
              </span>
              <span className="text-light opacity-75 small">
                (Totale: € {totalPrice})
              </span>
            </div>
          </div>

          <div className="d-flex gap-3">
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleShowCart}
              className="px-4 fw-semibold"
            >
              Visualizza Carrello
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleCloseCart();
                navigate("/checkout", { state: { cart, totalPrice } });
              }}
              className="px-4 fw-bold shadow-sm border-0"
              style={{ backgroundColor: "#EED972", color: "#221915" }}
            >
              Procedi al Checkout
            </Button>
          </div>
        </div>
      )}

      <Container>
        <div className="text-center mb-5">
          <span
            className="text-uppercase tracking-widest fw-semibold small d-block mb-2"
            style={{ color: "#EED972", letterSpacing: "2px" }}
          >
            Eccellenze Artigianali dal 1943
          </span>
          <h1
            className="display-4 fw-bold mb-3 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Il nostro Forno Online
          </h1>
          <p
            className="text-light opacity-75"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Scegli tra i prodotti freschi di giornata, preparati con passione,
            metodi tradizionali e ingredienti selezionati.
          </p>
        </div>

        <div
          className="p-4 p-lg-5 mb-5 rounded shadow-lg position-relative overflow-hidden"
          style={{
            backgroundColor: "rgba(45, 35, 30, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(238, 217, 114, 0.3)",
          }}
        >
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Badge
                id="bestseller"
                className="mb-3 px-3 py-2 fw-bold text-uppercase shadow-sm border-0"
                style={{ backgroundColor: "#EED972", color: "#221915" }}
              >
                <i className="bi bi-star-fill me-1"></i> Il Nostro Bestseller
              </Badge>
              <h2
                className="fw-bold mb-3 text-white"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: "2.2rem",
                }}
              >
                Fette Biscottate Artigianali
              </h2>
              <p
                className="text-light opacity-90 mb-4"
                style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
              >
                Le inconfondibili fette biscottate del Forno Matillo: croccanti,
                fragranti e dorate alla perfezione.
              </p>
              <div className="d-flex align-items-center gap-4">
                <span className="fs-2 fw-bold" style={{ color: "#EED972" }}>
                  € 6,50
                </span>
                <Button
                  size="lg"
                  className="px-4 fw-semibold shadow border-0"
                  style={{ backgroundColor: "#EED972", color: "#221915" }}
                  onClick={() =>
                    addToCart({
                      id: 99,
                      name: "Fette Biscottate Artigianali",
                      price: "€ 6,50",
                      rawPrice: 6.5,
                    })
                  }
                >
                  Acquista Bestseller
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={fetteBiscottateImg}
                alt="Fette Biscottate Artigianali Matillo"
                className="img-fluid rounded shadow-sm"
                style={{
                  maxHeight: "320px",
                  objectFit: "cover",
                  width: "100%",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </Col>
          </Row>
        </div>

        <div className="d-flex justify-content-center gap-2 gap-md-3 mb-5 flex-wrap">
          {[
            { key: "tutti", label: "Tutti i Prodotti" },
            { key: "pane", label: "Pane Fresco" },
            { key: "dolci", label: "Dolci & Forno" },
            { key: "pizze", label: "Pizze & Focacce" },
          ].map((cat) => (
            <Button
              key={cat.key}
              variant={selectedCategory === cat.key ? "" : "outline-light"}
              className={`px-4 py-2 fw-semibold shadow-sm ${
                selectedCategory === cat.key
                  ? "border-0"
                  : "text-light border-opacity-25"
              }`}
              style={
                selectedCategory === cat.key
                  ? { backgroundColor: "#EED972", color: "#221915" }
                  : {}
              }
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        <Row className="g-4 mb-5">
          {filteredProducts.map((product) => (
            <Col md={6} lg={4} key={product.id}>
              <Card
                className="h-100 border-0 text-white"
                style={{
                  backgroundColor: "rgba(45, 35, 30, 0.55)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(238, 217, 114, 0.2)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ height: "230px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    style={{ height: "100%", objectFit: "cover" }}
                  />
                </div>
                <Card.Body className="d-flex flex-column p-4">
                  <Card.Title
                    className="fw-bold mb-2 text-white"
                    style={{ fontSize: "1.3rem" }}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-light opacity-75 small mb-4 flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-secondary border-opacity-25">
                    <span className="fs-5 fw-bold" style={{ color: "#EED972" }}>
                      {product.price}
                    </span>
                    <Button
                      size="sm"
                      className="px-3 py-2 fw-semibold shadow-sm border-0"
                      style={{ backgroundColor: "#EED972", color: "#221915" }}
                      onClick={() => addToCart(product)}
                    >
                      Aggiungi
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Shop;
