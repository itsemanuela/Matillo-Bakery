import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/20210118_MAT_Presentazione concept_page-0012.jpg";

import imgPizza from "../assets/shop_pizze/PEPP5044.jpg";
import imgDolce1 from "../assets/shop_dolci/20210319131959_PEPP7125.jpg";
import imgPane from "../assets/shop_pane/PEPP5390.jpg";
import imgDolce2 from "../assets/shop_dolci/PEPP5460.jpg";
import imgCasatillo from "../assets/20210118_MAT_Presentazione concept_page-0015.jpg";

const POLAROIDS = [
  {
    img: imgPizza,
    caption: "Le nostre pizze",
    width: 175,
    desktopPos: { left: "2%", top: "200px" },
    rotate: -7,
    delay: 0,
  },
  {
    img: imgDolce1,
    caption: "Dolci fatti a mano",
    width: 130,
    desktopPos: { left: "18%", top: "140px" },
    rotate: 6,
    delay: 0.25,
  },
  {
    img: imgPane,
    caption: "Pane fresco",
    width: 145,
    desktopPos: { left: "1%", top: "440px" },
    rotate: 4,
    delay: 0.5,
  },
  {
    img: imgDolce2,
    caption: "Dolcezza artigianale",
    width: 120,
    desktopPos: { left: "23%", top: "370px" },
    rotate: -5,
    delay: 0.75,
  },
  {
    img: imgCasatillo,
    caption: "Casatiello",
    width: 150,
    desktopPos: { left: "37%", top: "190px" },
    rotate: 8,
    delay: 1.0,
  },
];

function PolaroidCard({ img, caption, width, rotate }) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [rotate - 1.5, rotate + 1.5, rotate - 1.5],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width: `${width}px`,
        backgroundColor: "#faf7f0",
        padding: "10px 10px 16px",
        borderRadius: "3px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
      }}
    >
      <div style={{ overflow: "hidden", borderRadius: "1px" }}>
        <img
          src={img}
          alt={caption}
          style={{
            width: "100%",
            height: `${width * 0.82}px`,
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
      <p
        className="text-center mb-0 mt-2"
        style={{
          fontFamily: "'Allura', cursive",
          fontSize: "1.3rem",
          color: "#3d2c24",
          lineHeight: 1,
        }}
      >
        {caption}
      </p>
    </motion.div>
  );
}

function PolaroidWrapper({ card, style }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
      viewport={{ once: true }}
      transition={{ delay: card.delay, duration: 0.7, ease: "easeOut" }}
      style={{ position: "absolute", zIndex: 2, ...style }}
    >
      <PolaroidCard
        img={card.img}
        caption={card.caption}
        width={card.width}
        rotate={card.rotate}
      />
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 12 },
  },
};

function Hero() {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section text-white d-flex align-items-center position-relative"
      style={{ "--hero-bg": `url(${heroImg})` }}
    >
      <div className="d-none d-lg-block">
        {POLAROIDS.map((card, i) => (
          <PolaroidWrapper key={i} card={card} style={card.desktopPos} />
        ))}
      </div>

      <div
        className="d-flex d-lg-none justify-content-center gap-3 flex-wrap mb-4"
        style={{ position: "relative", zIndex: 2, paddingTop: "10px" }}
      >
        {POLAROIDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: card.delay, duration: 0.5 }}
          >
            <PolaroidCard
              img={card.img}
              caption={card.caption}
              width={90}
              rotate={card.rotate * 0.6}
            />
          </motion.div>
        ))}
      </div>

      <Container fluid className="px-lg-5 position-relative hero-container-z">
        <Row className="align-items-center justify-content-end">
          <Col lg={6} xl={5} className="text-lg-start text-center px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="hero-title display-4 fw-bold mb-3"
                variants={itemVariants}
              >
                L'arte del pane dal 1943
              </motion.h1>

              <motion.p
                className="hero-lead lead mb-4 fw-medium"
                variants={itemVariants}
              >
                Tradizione, passione artigianale e ingredienti genuini ogni
                singolo giorno per portare sulla tua tavola il profumo della
                vera qualità.
              </motion.p>

              <motion.div
                className="d-flex justify-content-lg-start justify-content-center gap-3 flex-wrap"
                variants={itemVariants}
              >
                <Button
                  variant="outline-light"
                  size="lg"
                  onClick={() => navigate("/shop")}
                  className="px-4 py-2 shadow-sm fw-semibold"
                >
                  Scopri i Prodotti
                </Button>
                <Button
                  variant="light"
                  size="lg"
                  onClick={() => navigate("/ricette")}
                  className="px-4 py-2 text-dark fw-semibold shadow-sm"
                >
                  Le nostre Ricette
                </Button>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <div className="hero-bottom-gradient"></div>
    </div>
  );
}

export default Hero;
