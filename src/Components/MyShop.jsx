import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("TUTTI");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [prodotti, setProdotti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const navigate = useNavigate();

  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);

  useEffect(() => {
    fetch(`${API_URL}/prodotti`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Errore nel caricamento dei prodotti");
        }
        return res.json();
      })
      .then((data) => {
        setProdotti(data);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const totalPrice = cart
    .reduce((sum, item) => sum + item.prezzo, 0)
    .toFixed(2);

  const filteredProducts =
    selectedCategory === "TUTTI"
      ? prodotti
      : prodotti.filter((p) => p.categoria === selectedCategory);

  const bestseller = prodotti.find((p) => p.disponibile) || prodotti[0];

  return (
    <div
      className="bg-custom-shop"
      style={{
        backgroundColor: "#221915",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "120px",
        position: "relative",
      }}
    >
      <style>{`
        .product-card {
          background-color: rgba(255, 255, 255, 0.045) !important;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          border-color: rgba(238, 217, 114, 0.35);
        }
        .category-btn { transition: transform 0.2s ease; }
        .category-btn:hover { transform: translateY(-2px); }
        .add-btn, .bestseller-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .add-btn:hover, .bestseller-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(238, 217, 114, 0.35);
        }
        .add-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <Offcanvas
        show={showCart}
        onHide={handleCloseCart}
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Header
          closeButton
          closeVariant="white"
          className="border-bottom border-secondary border-opacity-25"
        >
          <Offcanvas.Title className="cart-title fw-bold">
            Il tuo Carrello artigianale
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column cart-body">
          {cart.length === 0 ? (
            <div className="text-center my-auto text-light opacity-75">
              <p className="fs-1 mb-3 cart-gold-text">
                <i className="bi bi-bag"></i>
              </p>
              <p className="fs-5 mb-1">Il carrello è vuoto.</p>
              <small>
                Aggiungi i tuoi prodotti preferiti dal nostro forno!
              </small>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto cart-items-container">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom border-secondary border-opacity-25"
                  >
                    <div>
                      <h6 className="mb-0 fw-bold text-white">{item.nome}</h6>
                      <small className="cart-gold-text">
                        € {item.prezzo.toFixed(2)}
                      </small>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeFromCart(index)}
                      className="cart-remove-btn"
                    >
                      Rimuovi
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-top border-secondary border-opacity-25 mt-auto">
                <div className="d-flex justify-content-between fs-5 fw-bold mb-3 text-white">
                  <span>Totale:</span>
                  <span className="cart-gold-text">€ {totalPrice}</span>
                </div>
                <Button
                  className="cart-btn-gold w-100 py-3 fw-bold shadow border-0"
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

      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            right: "0",
            backgroundColor: "rgba(34, 25, 21, 0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(238, 217, 114, 0.25)",
            padding: "15px 30px",
            zIndex: 1000,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
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
              style={{ borderRadius: "10px" }}
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
              style={{
                backgroundColor: "#EED972",
                color: "#221915",
                borderRadius: "10px",
              }}
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

        {/* Stato di caricamento */}
        {caricamento && (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
            <p className="text-light opacity-75 mt-3">Carico i prodotti...</p>
          </div>
        )}

        {/* Stato di errore */}
        {errore && (
          <div className="text-center py-5">
            <p className="text-light">
              Non riesco a caricare i prodotti al momento. Riprova più tardi.
            </p>
          </div>
        )}

        {!caricamento && !errore && (
          <>
            {/* BESTSELLER — primo prodotto disponibile */}
            {bestseller && (
              <div
                className="p-4 p-lg-5 mb-5 position-relative overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.045)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "24px",
                  boxShadow:
                    "0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
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
                <Row className="align-items-center">
                  <Col lg={6} className="mb-4 mb-lg-0">
                    <span
                      className="mb-3 px-3 py-2 fw-semibold text-uppercase d-inline-block"
                      style={{
                        backgroundColor: "rgba(238, 217, 114, 0.12)",
                        color: "#EED972",
                        border: "1px solid rgba(238, 217, 114, 0.4)",
                        letterSpacing: "1px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                      }}
                    >
                      <i className="bi bi-star-fill me-1"></i> In Evidenza
                    </span>
                    <h2
                      className="fw-bold mb-3 text-white"
                      style={{
                        fontFamily: "'Roboto Serif', serif",
                        fontSize: "2.2rem",
                      }}
                    >
                      {bestseller.nome}
                    </h2>
                    <p
                      className="text-light opacity-90 mb-4"
                      style={{ fontSize: "1.1rem", lineHeight: "1.7" }}
                    >
                      {bestseller.descrizione}
                    </p>
                    <div className="d-flex align-items-center gap-4">
                      <span
                        className="fs-2 fw-bold"
                        style={{ color: "#EED972" }}
                      >
                        € {bestseller.prezzo.toFixed(2)}
                      </span>
                      <Button
                        size="lg"
                        className="px-4 fw-semibold border-0 bestseller-btn"
                        disabled={!bestseller.disponibile}
                        style={{
                          backgroundColor: "#EED972",
                          color: "#221915",
                          borderRadius: "12px",
                        }}
                        onClick={() => addToCart(bestseller)}
                      >
                        {bestseller.disponibile
                          ? "Aggiungi al carrello"
                          : "Non disponibile"}
                      </Button>
                    </div>
                  </Col>
                  <Col lg={6} className="text-center">
                    <div
                      style={{
                        borderRadius: "18px",
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                      }}
                    >
                      <img
                        src={bestseller.immagine || PLACEHOLDER_IMG}
                        alt={bestseller.nome}
                        className="img-fluid"
                        style={{
                          maxHeight: "320px",
                          objectFit: "cover",
                          width: "100%",
                          display: "block",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* Filtri categoria — costruiti dinamicamente dalle categorie presenti nei prodotti */}
            <div className="d-flex justify-content-center gap-2 gap-md-3 mb-5 flex-wrap">
              {["TUTTI", ...new Set(prodotti.map((p) => p.categoria))].map(
                (cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "" : "outline-light"}
                    className={`px-4 py-2 fw-semibold shadow-sm category-btn ${
                      selectedCategory === cat
                        ? "border-0"
                        : "text-light border-opacity-25"
                    }`}
                    style={{
                      borderRadius: "10px",
                      ...(selectedCategory === cat
                        ? { backgroundColor: "#EED972", color: "#221915" }
                        : {}),
                    }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "TUTTI" ? "Tutti i Prodotti" : cat}
                  </Button>
                ),
              )}
            </div>

            {/* GRIGLIA PRODOTTI */}
            <Row className="g-4 mb-5">
              {filteredProducts.map((product) => (
                <Col md={6} lg={4} key={product.uuid}>
                  <Card className="h-100 border-0 text-white product-card">
                    <div
                      style={{
                        height: "230px",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={product.immagine || PLACEHOLDER_IMG}
                        alt={product.nome}
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                      {!product.disponibile && (
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            backgroundColor: "rgba(20,15,12,0.85)",
                            color: "#f8f9fa",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Esaurito
                        </div>
                      )}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "50px",
                          background:
                            "linear-gradient(to top, rgba(20,15,12,0.25), transparent)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column p-4">
                      <Card.Title
                        className="fw-bold mb-2 text-white"
                        style={{ fontSize: "1.3rem" }}
                      >
                        {product.nome}
                      </Card.Title>
                      <Card.Text className="text-light opacity-75 small mb-4 flex-grow-1">
                        {product.descrizione}
                      </Card.Text>
                      <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-secondary border-opacity-25">
                        <span
                          className="fs-5 fw-bold"
                          style={{ color: "#EED972" }}
                        >
                          € {product.prezzo.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="px-3 py-2 fw-semibold border-0 add-btn"
                          disabled={!product.disponibile}
                          style={{
                            backgroundColor: "#EED972",
                            color: "#221915",
                            borderRadius: "8px",
                          }}
                          onClick={() => addToCart(product)}
                        >
                          {product.disponibile ? "Aggiungi" : "Esaurito"}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {filteredProducts.length === 0 && (
              <p className="text-center text-light opacity-75 py-5">
                Nessun prodotto trovato in questa categoria.
              </p>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default Shop;
