import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import fetteBiscottateImg from "../assets/20210118_MAT_Presentazione concept_page-0008.jpg";
//import tortanoVideo from "../assets/lavorazione/20210402162217_PEPP7304.MP4";

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("tutti");

  const products = [
    {
      id: 1,
      name: "Crostata Artigianale",
      category: "dolci",
      description:
        "Fatta in casa con pasta frolla burrosa e confettura extra di frutta di stagione.",
      price: "€ 14,00",
      image: fetteBiscottateImg,
    },
    {
      id: 2,
      name: "Brioches Soffici",
      category: "dolci",
      description:
        "Soffice impasto lievitato naturalmente, profumato alla vaniglia e agrumi.",
      price: "€ 2,50",
      image: fetteBiscottateImg,
    },
    {
      id: 3,
      name: "Zeppole Tradizionali",
      category: "dolci",
      description:
        "Friabili fuori e morbide dentro, guarnite con crema pasticcera e amarene.",
      price: "€ 3,00",
      image: fetteBiscottateImg,
    },
    {
      id: 4,
      name: "Pizza in Teglia alla Romana",
      category: "pizze",
      description:
        "Alta idratazione, alveolatura perfetta, croccante e condita con pomodoro e basilico.",
      price: "€ 4,50",
      image: fetteBiscottateImg,
    },
    {
      id: 5,
      name: "Focaccia Genovese Classica",
      category: "pizze",
      description:
        "Morbida, alta, condita con olio extravergine d'oliva e fior di sale.",
      price: "€ 3,80",
      image: fetteBiscottateImg,
    },
    {
      id: 6,
      name: "Pagnotta di Grano Duro",
      category: "pane",
      description:
        "Lievitazione naturale con pasta madre, crosta croccante e mollica dorata.",
      price: "€ 4,00",
      image: fetteBiscottateImg,
    },
    {
      id: 7,
      name: "Pane ai Cereali e Semi",
      category: "pane",
      description:
        "Ricco di semi misti e farine macinate a pietra, rustico e nutriente.",
      price: "€ 4,50",
      image: fetteBiscottateImg,
    },
  ];

  const filteredProducts =
    selectedCategory === "tutti"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div
      style={{
        backgroundColor: "#1c1613",
        color: "#f8f9fa",
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <h1
            className="display-4 fw-bold mb-3 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Il nostro Forno Online
          </h1>
          <p
            className="lead text-light opacity-75"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Scegli tra i prodotti freschi di giornata, preparati con passione,
            metodi tradizionali e ingredienti selezionati.
          </p>
        </div>

        <div
          className="p-4 p-lg-5 mb-5 rounded shadow-lg position-relative overflow-hidden"
          style={{
            backgroundColor: "#2a221d",
            border: "1px solid rgba(212, 175, 55, 0.3)",
          }}
        >
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Badge
                bg="warning"
                text="dark"
                className="mb-3 px-3 py-2 fw-bold text-uppercase"
              >
                Il Nostro Bestseller
              </Badge>
              <h2
                className="fw-bold mb-3 text-white"
                style={{ fontFamily: "'Roboto Serif', serif" }}
              >
                Fette Biscottate Artigianali
              </h2>
              <p
                className="text-light mb-4"
                style={{ fontSize: "1.1rem", lineHeight: "1.6" }}
              >
                Le inconfondibili fette biscottate del Forno Matillo: croccanti,
                fragranti e dorate alla perfezione. L'accompagnamento ideale per
                iniziare la giornata con la genuinità della tradizione del 1943.
              </p>
              <div className="d-flex align-items-center gap-4">
                <span className="fs-3 fw-bold text-warning">€ 6,50</span>
                <Button
                  variant="warning"
                  size="lg"
                  className="px-4 fw-semibold text-dark shadow-sm"
                  onClick={() => alert("Aggiunto al carrello!")}
                >
                  Acquista Bestseller
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <img
                src={fetteBiscottateImg}
                alt="Fette Biscottate Artigianali Matillo"
                className="img-fluid rounded shadow"
                style={{
                  maxHeight: "320px",
                  objectFit: "cover",
                  width: "100%",
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
              variant={
                selectedCategory === cat.key ? "warning" : "outline-light"
              }
              className={`px-4 py-2 fw-semibold ${
                selectedCategory === cat.key ? "text-dark" : "text-light"
              }`}
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
                className="h-100 shadow border-0 text-white"
                style={{
                  backgroundColor: "#241d18",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <div style={{ height: "220px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    style={{
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column p-4">
                  <Card.Title
                    className="fw-bold mb-2 text-white"
                    style={{ fontFamily: "'Roboto Serif', serif" }}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="text-light opacity-75 small mb-4 flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <div className="d-flex align-items-center justify-content-between mt-auto">
                    <span className="fs-5 fw-bold text-warning">
                      {product.price}
                    </span>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="px-3 fw-semibold text-white"
                      onClick={() =>
                        alert(`${product.name} aggiunto al carrello!`)
                      }
                    >
                      Aggiungi
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div
          className="mt-5 p-4 p-lg-5 rounded text-center shadow-lg"
          style={{
            backgroundColor: "#2a221d",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <h3
            className="fw-bold mb-3 text-white"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            L'arte dell'intreccio: Il nostro Tortano
          </h3>
          <p
            className="text-light opacity-75 mb-4 mx-auto"
            style={{ maxWidth: "700px" }}
          >
            Guarda come le mani sapienti dei nostri fornai intrecciano
            lentamente l'impasto secondo la ricetta originale di famiglia. Ogni
            pezzo è un'opera d'arte artigianale.
          </p>
          <div
            className="ratio ratio-16x9 mx-auto rounded overflow-hidden shadow"
            style={{ maxWidth: "800px", maxHeight: "450px" }}
          >
            <video
              //src={tortanoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-100 h-100 object-fit-cover"
            />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Shop;
