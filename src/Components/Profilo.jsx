import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import sfondoOrdini from "../assets/20210118_MAT_Presentazione concept_page-0011.jpg";

function ProfiloUtente() {
  const navigate = useNavigate();
  const [utenteLoggato, setUtenteLoggato] = useState(() => {
    const salvato = localStorage.getItem("utente");
    return salvato ? JSON.parse(salvato) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    setUtenteLoggato(null);
    navigate("/");
  };

  if (!utenteLoggato) {
    return (
      <div
        style={{
          background: `linear-gradient(90deg, transparent 0%, transparent 55%, rgba(44,34,30,0.5) 75%, rgba(44,34,30,0.75) 100%), linear-gradient(160deg, rgba(58,43,35,0.55) 0%, rgba(44,34,30,0.65) 100%), url(${sfondoOrdini}) center center / cover no-repeat`,
          color: "#EFECE6",
          minHeight: "100vh",
          paddingTop: "140px",
          paddingBottom: "100px",
        }}
      >
        <Container style={{ maxWidth: "440px" }} className="text-center">
          <div
            className="p-5 shadow-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
            }}
          >
            <h4
              className="text-white fw-bold mb-3"
              style={{ fontFamily: "'Roboto Serif', serif" }}
            >
              Area Riservata
            </h4>
            <p className="small text-light opacity-75 mb-4">
              Effettua l'accesso per visualizzare il tuo profilo.
            </p>
            <Button
              onClick={() => navigate("/accedi")}
              className="w-100 fw-bold border-0 py-3 shadow-sm"
              style={{
                backgroundColor: "#D4C37E",
                color: "#1D1512",
                borderRadius: "10px",
              }}
            >
              Accedi
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      style={{
        background: `linear-gradient(90deg, transparent 0%, transparent 55%, rgba(44,34,30,0.5) 75%, rgba(44,34,30,0.75) 100%), linear-gradient(160deg, rgba(58,43,35,0.55) 0%, rgba(44,34,30,0.65) 100%), url(${sfondoOrdini}) center center / cover no-repeat`,
        color: "#EFECE6",
        minHeight: "100vh",
        paddingTop: "140px",
        paddingBottom: "100px",
      }}
    >
      <style>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profilo-box {
          animation: fadeInSlide 0.4s ease forwards;
          position: relative;
          overflow: hidden;
        }
        .filo-oro {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4C37E, transparent);
        }
        .azione-btn {
          transition: all 0.3s ease;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .azione-btn:hover {
          background-color: rgba(212, 195, 126, 0.15) !important;
          border-color: #D4C37E !important;
          transform: translateY(-2px);
        }
      `}</style>

      <Container style={{ maxWidth: "550px" }}>
        <div
          className="profilo-box p-5 shadow-lg text-center mx-auto"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "24px",
          }}
        >
          <div className="filo-oro" />

          {/* Avatar circolare con iniziale o icona */}
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              backgroundColor: "rgba(212, 195, 126, 0.15)",
              border: "1px solid rgba(212, 195, 126, 0.3)",
              color: "#D4C37E",
              fontSize: "2rem",
              fontFamily: "'Roboto Serif', serif",
            }}
          >
            {utenteLoggato.nome ? (
              utenteLoggato.nome.charAt(0).toUpperCase()
            ) : (
              <i className="bi bi-person"></i>
            )}
          </div>

          <span
            className="text-uppercase fw-semibold"
            style={{ color: "#D4C37E", fontSize: "11px", letterSpacing: "2px" }}
          >
            Benvenuto/a nel tuo spazio
          </span>
          <h2
            className="text-white fw-bold mt-1 mb-1 display-6"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            {utenteLoggato.nome}
          </h2>
          <p className="small text-light opacity-75 mb-4">
            {utenteLoggato.email}
          </p>

          <div className="d-flex flex-column gap-3 mb-4">
            <Button
              onClick={() => navigate("/miei-ordini")}
              className="azione-btn text-white w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-none"
            >
              <i className="bi bi-bag-fill" style={{ color: "#D4C37E" }}></i> I
              Miei Ordini
            </Button>
            <Button
              onClick={() => navigate("/le-mie-prenotazioni")}
              className="azione-btn text-white w-100 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-none"
            >
              <i
                className="bi bi-calendar-check-fill"
                style={{ color: "#D4C37E" }}
              ></i>{" "}
              Le Mie Prenotazioni
            </Button>
          </div>

          <div
            className="pt-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              onClick={handleLogout}
              className="btn btn-link text-decoration-none p-0 small fw-semibold"
              style={{ color: "#e08585", transition: "opacity 0.2s" }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Esci dall'account
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProfiloUtente;
