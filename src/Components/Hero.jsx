import { useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImg from "../assets/lavorazione/hero.jpg";

const dustParticles = [
  { left: "4%", size: 7, delay: 0, duration: 5.5 },
  { left: "16%", size: 5, delay: 0.5, duration: 6.5 },
  { left: "30%", size: 8, delay: 1, duration: 5 },
  { left: "48%", size: 6, delay: 0.2, duration: 7 },
  { left: "64%", size: 5, delay: 1.3, duration: 5.5 },
  { left: "78%", size: 7, delay: 0.8, duration: 6 },
  { left: "92%", size: 6, delay: 1.6, duration: 6.5 },
];

const textReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const frameVariants = {
  hidden: { opacity: 0, scale: 0.94, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -2,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
  },
};

const numeralVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 0.15,
    scale: 1,
    transition: { duration: 1.8, ease: "easeOut" },
  },
};

function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const yPhoto = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const yNumeral = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div
      ref={sectionRef}
      className="position-relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, #e87722 0%, transparent 55%), linear-gradient(180deg, #1c1613 0%, #2b1f1a 45%, #b34a14 80%, #d95c14 100%)",
        paddingTop: "11rem",
        paddingBottom: "8rem",
      }}
    >
      <motion.span
        variants={numeralVariants}
        initial="hidden"
        animate="visible"
        style={{
          y: yNumeral,
          fontFamily: "'Roboto Serif', serif",
          fontWeight: 700,
          fontSize: "clamp(14rem, 26vw, 24rem)",
          lineHeight: 1,
          color: "#EED972",
          top: "1rem",
          right: "-2rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
        className="d-none d-lg-block position-absolute"
      >
        1943
      </motion.span>

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <Row className="align-items-center g-5">
          <Col lg={5} className="text-center text-lg-start">
            <motion.div
              variants={textReveal}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={lineVariants} className="mb-3">
                <span
                  className="d-inline-block"
                  style={{
                    fontFamily: "'Allura', cursive",
                    fontSize: "2.4rem",
                    color: "#EED972",
                    lineHeight: 1,
                  }}
                >
                  Dal 1943, con le mani
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "72px" }}
                  transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
                  className="d-block"
                  style={{
                    height: "2px",
                    backgroundColor: "#EED972",
                    marginTop: "6px",
                  }}
                />
              </motion.div>

              <motion.h1
                variants={lineVariants}
                className="fw-bold mb-4"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
                  lineHeight: 1.05,
                  color: "#F4F1EA",
                  textShadow: "0 3px 6px rgba(0,0,0,0.9)",
                }}
              >
                Il pane si aspetta,
                <br />
                non si affretta
              </motion.h1>

              <motion.p
                variants={lineVariants}
                className="mb-5 mx-auto mx-lg-0"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: 1.8,
                  color: "#f5ebd8",
                  maxWidth: "480px",
                }}
              >
                Grani selezionati, lievito madre e la pazienza di una
                lievitazione lunga: l'Antico Forno Matillo porta ancora oggi in
                tavola il pane come lo faceva tre generazioni fa.
              </motion.p>

              <motion.div
                variants={lineVariants}
                className="d-flex gap-3 flex-wrap justify-content-center justify-content-lg-start"
              >
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    onClick={() => navigate("/shop")}
                    className="px-4 py-2 fw-semibold border-0"
                    style={{
                      backgroundColor: "#EED972",
                      color: "#1c1613",
                      borderRadius: "999px",
                      boxShadow: "0 10px 24px rgba(238,217,114,0.35)",
                    }}
                  >
                    Scopri i Prodotti
                  </Button>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="lg"
                    variant="outline-light"
                    onClick={() => navigate("/ricette")}
                    className="px-4 py-2 fw-semibold"
                    style={{
                      borderRadius: "999px",
                      borderColor: "#F4F1EA",
                      color: "#F4F1EA",
                    }}
                  >
                    Le Nostre Ricette
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </Col>

          <Col lg={7}>
            <motion.div
              variants={frameVariants}
              initial="hidden"
              animate="visible"
              style={{ y: yPhoto }}
              className="position-relative mx-auto"
            >
              <motion.div
                animate={{ opacity: [0.55, 0.9, 0.55] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="position-absolute top-50 start-50"
                style={{
                  width: "85%",
                  height: "85%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(232,119,34,0.55), transparent 70%)",
                  filter: "blur(50px)",
                  zIndex: 0,
                }}
              />

              {dustParticles.map((p, i) => (
                <motion.span
                  key={i}
                  className="position-absolute"
                  style={{
                    left: p.left,
                    bottom: "2%",
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    borderRadius: "50%",
                    backgroundColor: "#EED972",
                    boxShadow: "0 0 10px 3px rgba(238,217,114,0.9)",
                    zIndex: 5,
                    pointerEvents: "none",
                  }}
                  animate={{
                    y: [0, -260],
                    x: [0, 14, -10, 6],
                    opacity: [0, 0.95, 0.95, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <div
                className="position-relative mx-auto"
                style={{
                  height: "clamp(320px, 52vw, 620px)",
                  maxWidth: "620px",
                  zIndex: 2,
                }}
              >
                <img
                  src={heroImg}
                  alt="Cottura del pane nel forno a legna dell'Antico Forno Matillo"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    objectFit: "contain",
                    filter: "drop-shadow(0 25px 40px rgba(0,0,0,0.5))",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 72% 72% at 50% 50%, black 55%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse 72% 72% at 50% 50%, black 55%, transparent 100%)",
                  }}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
                className="position-absolute d-flex align-items-center gap-2"
                style={{
                  bottom: "2rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#EED972",
                  fontFamily: "'Roboto Serif', serif",
                  zIndex: 4,
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "1px",
                    backgroundColor: "#EED972",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Forno a legna dal 1943
                </span>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Hero;
