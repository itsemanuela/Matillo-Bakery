import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

const colors = {
  char: "#2A1A10",
  crust: "#6E3A22",
  wheat: "#C98A34",
  gold: "#EED972",
  flour: "#F6EEDD",
};

const fontDisplay = "'Fraunces', 'Roboto Serif', serif";
const fontHand = "'Caveat', cursive";

const angoliRotazione = [-3, 2, -2, 4, -4, 3, -1, 2];

function fotoDiEvento(evento) {
  return evento.galleria
    ? evento.galleria.split(",").filter((u) => u.trim() !== "")
    : [];
}

function GalleriaEventi() {
  const [eventi, setEventi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/galleria-eventi`)
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento della galleria");
        return res.json();
      })
      .then((data) => {
        setEventi(data.filter((e) => fotoDiEvento(e).length > 0));
        setCaricamento(false);
      })
      .catch(() => setCaricamento(false));
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") vaiA(1);
      if (e.key === "ArrowLeft") vaiA(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const apriEvento = (evento) => setLightbox({ evento, indice: 0 });

  const vaiA = (delta) => {
    setLightbox((corrente) => {
      if (!corrente) return corrente;
      const foto = fotoDiEvento(corrente.evento);
      const nuovoIndice = (corrente.indice + delta + foto.length) % foto.length;
      return { ...corrente, indice: nuovoIndice };
    });
  };

  if (caricamento || eventi.length === 0) return null;

  return (
    <div style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
      <div className="text-center mb-5">
        <h3
          className="fw-semibold mb-2 display-6"
          style={{ fontFamily: fontDisplay, color: colors.crust }}
        >
          I Nostri Eventi
        </h3>
        <p className="small mb-0 fst-italic" style={{ color: "#5B4636" }}>
          Un assaggio di allestimenti e ricevimenti curati dall'Antico Forno
          Matillo.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "50px 32px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px 15px",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');
          .galleria-polaroid {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          }
          .galleria-polaroid:hover {
            transform: rotate(0deg) scale(1.07) translateY(-8px) !important;
            box-shadow: 0 30px 60px rgba(20, 12, 6, 0.35) !important;
            z-index: 10;
          }
          .galleria-polaroid:hover .galleria-polaroid-img {
            transform: scale(1.05);
          }
          .galleria-polaroid-img {
            transition: transform 0.6s ease;
          }
          .galleria-eventi-titolo {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>

        {eventi.map((evento, i) => {
          const foto = fotoDiEvento(evento);
          const rotazione = angoliRotazione[i % angoliRotazione.length];
          return (
            <div
              key={evento.uuid}
              className="galleria-polaroid"
              onClick={() => apriEvento(evento)}
              style={{
                width: "245px",
                backgroundColor: "#FFFFFF",
                padding: "14px 14px 20px",
                borderRadius: "4px",
                boxShadow: "0 12px 30px rgba(20, 12, 6, 0.18)",
                cursor: "pointer",
                position: "relative",
                transform: `rotate(${rotazione}deg)`,
              }}
            >
              {/* Spilla / Badge contatore in alto */}
              <div
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 35% 30%, ${colors.gold}, ${colors.wheat})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 5px 12px rgba(20, 12, 6, 0.35), inset 0 0 0 2px rgba(42, 26, 16, 0.12)",
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: foto.length > 1 ? "0.85rem" : "1rem",
                  color: colors.char,
                }}
              >
                {foto.length > 1 ? (
                  foto.length
                ) : (
                  <i className="bi bi-camera-fill"></i>
                )}
              </div>

              {/* Contenitore Immagine */}
              <div
                style={{
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  borderRadius: "2px",
                }}
              >
                <img
                  className="galleria-polaroid-img"
                  src={foto[0]}
                  alt={evento.titolo || "Evento Antico Forno Matillo"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Didascalia effetto manoscritto */}
              {evento.titolo && (
                <p
                  className="galleria-eventi-titolo text-center mb-0 mt-3 px-1"
                  style={{
                    fontFamily: fontHand,
                    color: colors.char,
                    fontSize: "1.4rem",
                    lineHeight: "1.15",
                  }}
                >
                  {evento.titolo}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modale */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(20, 12, 6, 0.94)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
            backdropFilter: "blur(5px)",
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              color: colors.flour,
              fontSize: "1.3rem",
              cursor: "pointer",
              zIndex: 1060,
              transition: "background 0.2s",
            }}
          >
            ✕
          </button>

          {fotoDiEvento(lightbox.evento).length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vaiA(-1);
                }}
                style={{
                  position: "absolute",
                  left: "24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: colors.flour,
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  zIndex: 1060,
                }}
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  vaiA(1);
                }}
                style={{
                  position: "absolute",
                  right: "24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: colors.flour,
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  zIndex: 1060,
                }}
              >
                ›
              </button>
            </>
          )}

          <div
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fotoDiEvento(lightbox.evento)[lightbox.indice]}
              alt={lightbox.evento.titolo || "Evento Antico Forno Matillo"}
              style={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: "8px",
                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6)",
                objectFit: "contain",
              }}
            />

            <div
              className="text-center mt-3 px-4 py-2"
              style={{
                maxWidth: "650px",
                borderRadius: "12px",
                backgroundColor: "rgba(20, 12, 6, 0.65)",
                backdropFilter: "blur(6px)",
              }}
            >
              {lightbox.evento.titolo && (
                <p
                  className="mb-1"
                  style={{
                    color: colors.flour,
                    fontSize: "1.05rem",
                    fontFamily: fontDisplay,
                  }}
                >
                  {lightbox.evento.titolo}
                </p>
              )}
              {fotoDiEvento(lightbox.evento).length > 1 && (
                <p
                  className="mb-0 small"
                  style={{ color: `${colors.flour}99` }}
                >
                  {lightbox.indice + 1} di{" "}
                  {fotoDiEvento(lightbox.evento).length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GalleriaEventi;
