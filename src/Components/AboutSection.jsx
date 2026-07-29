import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";

import foto1 from "../assets/lavorazione/PEPP4830.jpg";
import foto2 from "../assets/lavorazione/PEPP4856.jpg";
import foto3 from "../assets/lavorazione/PEPP4908.jpg";
import foto4 from "../assets/lavorazione/PEPP4932.jpg";
import foto5 from "../assets/lavorazione/PEPP5241.jpg";
import foto6 from "../assets/lavorazione/PEPP5272.jpg";
import foto7 from "../assets/lavorazione/PEPP5318.jpg";

const laboratoriocScatti = [
  { img: foto1, text: "La selezione accurata dei grani e delle farine" },
  { img: foto2, text: "La lavorazione artigianale tramandata nel tempo" },
  { img: foto3, text: "Il rispetto dei tempi lunghi di lievitazione naturale" },
  { img: foto4, text: "La cura meticolosa in ogni fase della preparazione" },
  { img: foto5, text: "I gesti esperti dei nostri panettieri" },
  {
    img: foto6,
    text: "La cottura nel forno e la magia della crosta fragrante",
  },
  { img: foto7, text: "Il profumo autentico del pane appena fatto" },
];

function AboutSection() {
  return (
    <section
      className="py-5"
      style={{ backgroundColor: "#241d18", color: "#f7f4ef" }}
    >
      <Container className="py-5">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <span className="text-uppercase tracking-wider fw-bold text-warning small d-block mb-2">
              Tradizione Artigianale
            </span>
            <h2
              className="display-5 fw-bold mb-4"
              style={{
                fontFamily: "'Roboto Serif', serif",
                lineHeight: "1.2",
                color: "#ffffff",
              }}
            >
              L'arte del pane tramandata di generazione in generazione
            </h2>
            <p
              className="lead opacity-90 mb-4"
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#e3ded6",
              }}
            >
              Dal 1943 l'Antico Forno Matillo è il punto di riferimento per chi
              ama il sapore autentico delle cose fatte bene. Ogni giorno
              selezioniamo con cura grani pregiati, lieviti naturali e
              ingredienti genuini del territorio.
            </p>
            <p
              className="mb-0"
              style={{ color: "#d0c7bc", lineHeight: "1.7", fontSize: "1rem" }}
            >
              Non è solo questione di ricette, ma di rispetto per il tempo:
              lasciamo che l'impasto lieviti naturalmente per garantire una
              digeribilità perfetta e una mollica soffice che sa di casa.
            </p>
          </Col>

          <Col lg={6}>
            <div className="shadow-lg rounded overflow-hidden border border-warning border-opacity-25">
              <Carousel
                fade
                interval={3000}
                pause="hover"
                indicators={true}
                controls={true}
                wrap={true}
              >
                {laboratoriocScatti.map((item, index) => (
                  <Carousel.Item key={index}>
                    <div style={{ height: "420px", backgroundColor: "#000" }}>
                      <Image
                        src={item.img}
                        className="w-100 h-100"
                        style={{ objectFit: "cover", opacity: "0.9" }}
                        alt={`Lavorazione Antico Forno Matillo ${index + 1}`}
                      />
                    </div>
                    <Carousel.Caption className="bg-dark bg-opacity-75 rounded p-2 mb-2">
                      <p className="m-0 small text-light">{item.text}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AboutSection;
