import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";
import { motion } from "framer-motion";
import DettaglioProdotto from "./DettaglioProdotto";
import ModaleSconto from "./ModaleSconto";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/api";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23241d18'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='18' fill='%23EED972' text-anchor='middle' dy='.3em'%3EFoto in arrivo%3C/text%3E%3C/svg%3E";

const bestsellerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      delay: (index % 6) * 0.07,
    },
  }),
};

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("TUTTI");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSconto, setShowSconto] = useState(false);
  const [prodotti, setProdotti] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);
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
        console.error(err);
        setErrore(
          err.message === "Failed to fetch"
            ? "Impossibile caricare i prodotti al momento. Riprova più tardi."
            : err.message,
        );
        setCaricamento(false);
      });
  }, []);

  useEffect(() => {
    const utenteLoggato = localStorage.getItem("utente");
    if (utenteLoggato) return;

    const timer = setTimeout(() => setShowSconto(true), 1200);
    return () => clearTimeout(timer);
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

  const bestseller =
    prodotti.find((p) => p.bestseller) ||
    prodotti.find((p) => p.disponibile) ||
    prodotti[0];

  return (
    <div
      className="bg-custom-shop"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(238,217,114,0.14) 0%, transparent 42%), radial-gradient(circle at 82% 10%, rgba(232,119,34,0.35) 0%, transparent 58%), linear-gradient(160deg, #e87722 0%, #d95c14 16%, #8a3e1c 45%, #2b1f1a 78%, #1c1613 100%)",
        backgroundAttachment: "fixed",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "8%",
          left: "5%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(238,217,114,0.08) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <motion.div
        animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(216,92,20,0.12) 0%, transparent 70%)",
          filter: "blur(18px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <style>{`
        .product-card {
          background-color: rgba(255, 255, 255, 0.09) !important;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 55px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(238, 217, 114, 0.2);
          border-color: rgba(238, 217, 114, 0.4);
        }
        .product-card-img-wrapper {
          overflow: hidden;
        }
        .product-card-img {
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-card-img {
          transform: scale(1.08);
        }
        .bestseller-img-wrap { overflow: hidden; }
        .bestseller-img {
          transition: transform 0.6s ease;
          filter: saturate(1.15) contrast(1.04);
        }
        .bestseller-img-wrap:hover .bestseller-img {
          transform: scale(1.06);
        }
        .category-pill {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(20,15,12,0.75);
          backdrop-filter: blur(6px);
          color: #EED972;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid rgba(238,217,114,0.3);
          z-index: 2;
        }
        .product-card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
          pointer-events: none;
        }
        .product-card:hover .product-card-overlay {
          background: rgba(0,0,0,0.05);
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
        .cart-header-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(238,217,114,0.5), transparent);
        }
        .cart-item-row {
          transition: background 0.2s ease;
          border-radius: 10px;
        }
        .cart-item-row:hover {
          background: rgba(238,217,114,0.05);
        }
        .cart-item-thumb {
          width: 52px;
          height: 52px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(238,217,114,0.2);
          flex-shrink: 0;
        }
        .cart-remove-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid rgba(224,133,133,0.35);
          background: transparent;
          color: #e08585;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .cart-remove-icon:hover {
          background: rgba(224,133,133,0.12);
          transform: scale(1.06);
        }
        .cart-offcanvas {
          background-image: radial-gradient(circle at 100% 0%, rgba(232,119,34,0.12) 0%, transparent 45%) !important;
        }
      `}</style>

      <Offcanvas
        show={showCart}
        onHide={handleCloseCart}
        placement="end"
        className="cart-offcanvas"
      >
        <Offcanvas.Header closeButton closeVariant="white" className="pb-3">
          <Offcanvas.Title className="cart-title fw-bold">
            Il tuo Carrello artigianale
          </Offcanvas.Title>
        </Offcanvas.Header>
        <div className="cart-header-line mx-4 mb-2" />
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
                    className="d-flex align-items-center gap-3 py-3 px-2 cart-item-row border-bottom border-secondary border-opacity-10"
                  >
                    <img
                      src={item.immagine || PLACEHOLDER_IMG}
                      alt={item.nome}
                      className="cart-item-thumb"
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0 fw-bold text-white">{item.nome}</h6>
                      <small className="cart-gold-text">
                        € {item.prezzo.toFixed(2)}
                      </small>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      aria-label={`Rimuovi ${item.nome}`}
                      className="cart-remove-icon border-0"
                    >
                      <i
                        className="bi bi-trash3"
                        style={{ fontSize: "0.85rem" }}
                      ></i>
                    </button>
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

      <Container style={{ position: "relative", zIndex: 1 }}>
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

        {caricamento && (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#EED972" }} />
            <p className="text-light opacity-75 mt-3">Carico i prodotti...</p>
          </div>
        )}

        {errore && (
          <div className="text-center py-5">
            <p className="text-light">
              Non riesco a caricare i prodotti al momento. Riprova più tardi.
            </p>
          </div>
        )}

        {!caricamento && !errore && (
          <>
            {bestseller && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={bestsellerVariants}
                className="mb-4 position-relative"
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15%",
                    left: "5%",
                    width: "45%",
                    height: "130%",
                    background:
                      "radial-gradient(circle, rgba(232,119,34,0.28) 0%, transparent 70%)",
                    filter: "blur(50px)",
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
                <Row
                  className="g-4 align-items-stretch position-relative"
                  style={{ zIndex: 1 }}
                >
                  <Col lg={5}>
                    <div
                      className="bestseller-img-wrap"
                      style={{
                        borderRadius: "20px",
                        height: "100%",
                        minHeight: "260px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                        cursor: "pointer",
                      }}
                      onClick={() => setProdottoSelezionato(bestseller)}
                    >
                      <img
                        src={bestseller.immagine || PLACEHOLDER_IMG}
                        alt={bestseller.nome}
                        className="bestseller-img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={7}>
                    <div
                      className="h-100 d-flex flex-column justify-content-center p-4 p-lg-5 position-relative overflow-hidden"
                      style={{
                        backgroundColor: "rgba(60, 30, 14, 0.5)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "20px",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
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
                      <span
                        className="mb-3 px-3 py-2 fw-semibold text-uppercase d-inline-block"
                        style={{
                          backgroundColor: "rgba(238, 217, 114, 0.15)",
                          color: "#EED972",
                          border: "1px solid rgba(238, 217, 114, 0.4)",
                          letterSpacing: "1px",
                          borderRadius: "8px",
                          fontSize: "0.8rem",
                          width: "fit-content",
                        }}
                      >
                        <i className="bi bi-star-fill me-1"></i> Bestseller
                      </span>
                      <h2
                        className="fw-bold mb-2 text-white"
                        style={{
                          fontFamily: "'Roboto Serif', serif",
                          fontSize: "2rem",
                        }}
                      >
                        {bestseller.nome}
                      </h2>
                      <p
                        className="text-light opacity-90 mb-3"
                        style={{ fontSize: "1rem", lineHeight: "1.6" }}
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
                    </div>
                  </Col>
                </Row>
              </motion.div>
            )}

            <div
              className="mx-auto mb-5"
              style={{
                maxWidth: "180px",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(238,217,114,0.5), transparent)",
              }}
            />

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

            <Row className="g-4 mb-5">
              {filteredProducts.map((product, index) => (
                <Col md={6} lg={4} key={product.uuid}>
                  <motion.div
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={cardVariants}
                    className="h-100"
                  >
                    <Card
                      className="h-100 border-0 text-white product-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => setProdottoSelezionato(product)}
                    >
                      <div
                        className="product-card-img-wrapper"
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
                          className="product-card-img"
                          style={{ height: "100%", objectFit: "cover" }}
                        />
                        <span className="category-pill">
                          {product.categoria}
                        </span>
                        <div className="product-card-overlay"></div>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            {product.disponibile ? "Aggiungi" : "Esaurito"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
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

      <DettaglioProdotto
        prodotto={prodottoSelezionato}
        show={!!prodottoSelezionato}
        onHide={() => setProdottoSelezionato(null)}
        onAddToCart={addToCart}
      />

      <ModaleSconto show={showSconto} onHide={() => setShowSconto(false)} />
    </div>
  );
}

export default Shop;
