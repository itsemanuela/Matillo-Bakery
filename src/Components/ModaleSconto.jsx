import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { motion } from "framer-motion";

const CODICE_SCONTO = "BENVENUTO10";

function ModaleSconto({ show, onHide }) {
  const [copiato, setCopiato] = useState(false);

  const copiaCodice = () => {
    navigator.clipboard.writeText(CODICE_SCONTO).then(() => {
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2000);
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 bg-transparent"
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(28, 22, 19, 0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(238, 217, 114, 0.25)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
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
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-25%",
            left: "-15%",
            width: "70%",
            height: "140%",
            background:
              "radial-gradient(circle, rgba(232,119,34,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <button
          onClick={onHide}
          aria-label="Chiudi"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            color: "#f8f9fa",
            fontSize: "1.1rem",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>

        <div className="p-4 p-md-5 text-center position-relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="d-inline-flex flex-column align-items-center justify-content-center mx-auto mb-3"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 32% 28%, #EED972, #d6be58)",
              boxShadow:
                "0 8px 20px rgba(20,12,6,0.5), inset 0 0 0 3px rgba(28,22,19,0.15)",
              color: "#1c1613",
              fontFamily: "'Roboto Serif', serif",
            }}
          >
            <span
              style={{ fontSize: "1.7rem", fontWeight: 700, lineHeight: 1 }}
            >
              10%
            </span>
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              di sconto
            </span>
          </motion.div>

          <h3
            className="fw-bold mb-2"
            style={{ fontFamily: "'Roboto Serif', serif", color: "#F4F1EA" }}
          >
            Un piccolo regalo di benvenuto
          </h3>
          <p className="mb-4" style={{ color: "#d9ccbc", fontSize: "0.95rem" }}>
            Usa questo codice per ottenere il 10% di sconto sul tuo primo ordine
            da Antico Forno Matillo.
          </p>

          <div
            onClick={copiaCodice}
            role="button"
            className="d-flex align-items-center justify-content-between mx-auto mb-4 px-4 py-3"
            style={{
              maxWidth: "280px",
              backgroundColor: "rgba(238,217,114,0.08)",
              border: "1px dashed rgba(238,217,114,0.5)",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            <span
              className="fw-bold"
              style={{
                color: "#EED972",
                letterSpacing: "0.12em",
                fontSize: "1.15rem",
                fontFamily: "'Roboto Serif', serif",
              }}
            >
              {CODICE_SCONTO}
            </span>
            <i
              className={`bi ${copiato ? "bi-check2" : "bi-clipboard"}`}
              style={{ color: "#EED972", fontSize: "1.1rem" }}
            ></i>
          </div>

          <button
            onClick={copiaCodice}
            className="w-100 fw-bold border-0 py-3 mb-2"
            style={{
              maxWidth: "280px",
              backgroundColor: "#EED972",
              color: "#1c1613",
              borderRadius: "10px",
            }}
          >
            {copiato ? "Codice copiato!" : "Copia il codice"}
          </button>

          <div>
            <button
              onClick={onHide}
              className="btn btn-link text-decoration-none small"
              style={{ color: "#d9ccbc" }}
            >
              No grazie, continuo a guardare
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModaleSconto;
