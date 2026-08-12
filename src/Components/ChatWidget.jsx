import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "http://localhost:3001/api/ordini";

const ETICHETTE_STATO = {
  IN_ELABORAZIONE: "In elaborazione",
  PAGATO: "Pagato",
  IN_PREPARAZIONE: "In preparazione",
  SPEDITO: "Spedito",
  CONSEGNATO: "Consegnato",
  CANCELLATO: "Annullato",
};

function ChatWidget() {
  const [aperto, setAperto] = useState(false);
  const [messaggi, setMessaggi] = useState([
    { autore: "bot", testo: "Ciao! Come posso aiutarti?" },
  ]);
  const [vista, setVista] = useState("menu");
  const [codiceOrdine, setCodiceOrdine] = useState("");
  const [email, setEmail] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  const [digitando, setDigitando] = useState(false);

  const fineMessaggiRef = useRef(null);

  useEffect(() => {
    fineMessaggiRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messaggi, digitando]);

  const aggiungiMessaggio = (autore, testo) => {
    setMessaggi((prev) => [...prev, { autore, testo }]);
  };

  const rispondiConRitardo = (testo, ritardo = 650) => {
    setDigitando(true);
    setTimeout(() => {
      setDigitando(false);
      aggiungiMessaggio("bot", testo);
    }, ritardo);
  };

  const gestisciMenu = (scelta) => {
    if (digitando) return;

    if (scelta === "stato") {
      aggiungiMessaggio("utente", "Stato ordine");
      rispondiConRitardo(
        "Inserisci il codice ordine (lo trovi nell'email di conferma) e l'email usata per l'acquisto.",
      );
      setVista("formStato");
    } else if (scelta === "orari") {
      aggiungiMessaggio("utente", "Orari e contatti");
      rispondiConRitardo(
        "Siamo aperti dal lunedì alla domenica 4:00 - 21:00. Sabato pomeriggio chiuso. Per contattarci: info@matillobakery.it",
      );
    } else if (scelta === "altro") {
      aggiungiMessaggio("utente", "Altro");
      rispondiConRitardo(
        "Per qualsiasi altra richiesta scrivici a info@matillobakery.it, ti risponderemo il prima possibile.",
      );
    }
  };

  const tornaAlMenu = () => {
    setVista("menu");
  };

  const richiediStato = async (e) => {
    e.preventDefault();
    if (!codiceOrdine || !email) return;

    setCaricamento(true);
    setDigitando(true);
    aggiungiMessaggio("utente", `Ordine ${codiceOrdine} - ${email}`);

    const inizio = Date.now();
    const RITARDO_MINIMO = 550;

    const concludi = (testoRisposta) => {
      const trascorso = Date.now() - inizio;
      const attesaResidua = Math.max(RITARDO_MINIMO - trascorso, 0);
      setTimeout(() => {
        setDigitando(false);
        aggiungiMessaggio("bot", testoRisposta);
        setCaricamento(false);
        setCodiceOrdine("");
        setEmail("");
        setVista("menu");
      }, attesaResidua);
    };

    try {
      const res = await fetch(
        `${API_BASE}/stato?numeroOrdine=${encodeURIComponent(codiceOrdine)}&email=${encodeURIComponent(email)}`,
      );

      if (!res.ok) {
        concludi(
          "Non ho trovato nessun ordine con questi dati. Controlla codice ordine ed email.",
        );
      } else {
        const data = await res.json();
        concludi(
          `Il tuo ordine è: ${ETICHETTE_STATO[data.stato] || data.stato}`,
        );
      }
    } catch (err) {
      concludi("Si è verificato un errore, riprova più tardi.");
    }
  };

  return (
    <div className="chat-widget-container">
      <AnimatePresence>
        {aperto && (
          <motion.div
            className="chat-widget-box"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-widget-header">
              <span>Matillo Bakery</span>
              <button onClick={() => setAperto(false)} aria-label="Chiudi chat">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="chat-widget-messages">
              {messaggi.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`chat-bubble chat-bubble-${m.autore}`}
                >
                  {m.testo}
                </motion.div>
              ))}
              {digitando && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chat-bubble chat-bubble-bot chat-typing"
                >
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </motion.div>
              )}
              <div ref={fineMessaggiRef} />
            </div>

            {vista === "menu" && (
              <div className="chat-widget-actions">
                <button
                  onClick={() => gestisciMenu("stato")}
                  disabled={digitando}
                >
                  Stato ordine
                </button>
                <button
                  onClick={() => gestisciMenu("orari")}
                  disabled={digitando}
                >
                  Orari e contatti
                </button>
                <button
                  onClick={() => gestisciMenu("altro")}
                  disabled={digitando}
                >
                  Altro
                </button>
              </div>
            )}

            {vista === "formStato" && (
              <form className="chat-widget-form" onSubmit={richiediStato}>
                <button
                  type="button"
                  className="chat-widget-back"
                  onClick={tornaAlMenu}
                  disabled={caricamento}
                >
                  <i className="bi bi-arrow-left"></i> Indietro
                </button>
                <input
                  type="text"
                  placeholder="Codice ordine"
                  value={codiceOrdine}
                  onChange={(e) => setCodiceOrdine(e.target.value)}
                  disabled={caricamento}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={caricamento}
                />
                <button type="submit" disabled={caricamento}>
                  {caricamento ? "Verifico..." : "Verifica"}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="chat-widget-toggle"
        onClick={() => setAperto((prev) => !prev)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={aperto ? "Chiudi assistente" : "Apri assistente"}
      >
        <motion.span
          animate={{ rotate: aperto ? 90 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ display: "flex" }}
        >
          {aperto ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <i className="bi bi-chat-dots-fill"></i>
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}

export default ChatWidget;
