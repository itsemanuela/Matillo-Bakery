import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import sfondoOrdini from "../assets/20210118_MAT_Presentazione concept_page-0011.jpg";

const API_URL = "http://localhost:3001/api";

function LeMiePrenotazioni() {
  const navigate = useNavigate();
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  // Stati per la gestione del Modale di Modifica
  const [showModal, setShowModal] = useState(false);
  const [prenotazioneSelezionata, setPrenotazioneSelezionata] = useState(null);
  const [numeroPersone, setNumeroPersone] = useState(1);

  // Stati per la gestione del Modale di Eliminazione Personalizzato
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idDaEliminare, setIdDaEliminare] = useState(null);
  const fetchPrenotazioni = () => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!token) {
      setCaricamento(false);
      return;
    }

    setCaricamento(true);
    fetch(`${API_URL}/prenotazioni/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero delle prenotazioni");
        return res.json();
      })
      .then((data) => {
        setPrenotazioni(data);
        setCaricamento(false);
      })
      .catch((err) => {
        console.error(err);
        setErrore(messaggioErrore(err));
        setCaricamento(false);
      });
  };

  useEffect(() => {
    fetchPrenotazioni();
  }, []);

  const handleApriModifica = (p) => {
    setPrenotazioneSelezionata(p);
    setNumeroPersone(p.numeroPersone || 1);
    setShowModal(true);
  };

  const handleSalvaModifica = (e) => {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    if (!prenotazioneSelezionata) return;

    const nuoviPostiInt = parseInt(numeroPersone, 10);
    const postiLiberiAttuali =
      prenotazioneSelezionata.laboratorio?.postiDisponibili || 0;
    const postiOccupatiInQuestaPrenotazione =
      prenotazioneSelezionata.numeroPersone || 0;
    const maxConsentito =
      postiLiberiAttuali + postiOccupatiInQuestaPrenotazione;

    if (nuoviPostiInt > maxConsentito) {
      alert(
        `Non puoi selezionare ${nuoviPostiInt} partecipanti. Il limite massimo disponibile per questo laboratorio è ${maxConsentito}.`,
      );
      return;
    }

    const targetId = prenotazioneSelezionata.uuid || prenotazioneSelezionata.id;

    fetch(`${API_URL}/prenotazioni/${targetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ numeroPersone: nuoviPostiInt }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const erroreTesto = await res.text();
          throw new Error(
            erroreTesto || "Errore durante la modifica della prenotazione",
          );
        }
        return res.json();
      })
      .then(() => {
        setShowModal(false);
        fetchPrenotazioni();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleApriConfermaEliminazione = (uuidOrId) => {
    setIdDaEliminare(uuidOrId);
    setShowDeleteModal(true);
  };

  const handleConfermaEliminazione = () => {
    if (!idDaEliminare) return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    // Corrisponde esattamente a @PatchMapping("/{id}/cancella") con UUID sul backend
    fetch(`${API_URL}/prenotazioni/${idDaEliminare}/cancella`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const erroreTesto = await res.text();
          throw new Error(erroreTesto || `Errore HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setShowDeleteModal(false);
        setIdDaEliminare(null);
        fetchPrenotazioni();
      })
      .catch((err) => {
        console.error("Errore cancellazione:", err);
        alert(err.message || "Errore durante la cancellazione");
      });
  };

  const maxConsentito = prenotazioneSelezionata
    ? (prenotazioneSelezionata.laboratorio?.postiDisponibili || 0) +
      (prenotazioneSelezionata.numeroPersone || 0)
    : 1;

  return (
    <div
      className="my-ordini-wrapper"
      style={{
        background: `linear-gradient(90deg, transparent 0%, transparent 55%, rgba(44,34,30,0.5) 75%, rgba(44,34,30,0.75) 100%), linear-gradient(160deg, rgba(58,43,35,0.55) 0%, rgba(44,34,30,0.65) 100%), url(${sfondoOrdini}) center center / cover no-repeat`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <Container style={{ maxWidth: "850px" }}>
        <div className="mb-5 text-start">
          <span
            className="text-uppercase fw-semibold"
            style={{
              color: "#EED972",
              fontSize: "11px",
              letterSpacing: "2.5px",
            }}
          >
            I tuoi eventi e laboratori
          </span>
          <h1
            className="fw-bold text-white mt-1 display-5"
            style={{ fontFamily: "'Roboto Serif', serif" }}
          >
            Le Mie Prenotazioni
          </h1>
          <div className="titolo-ordini-linea mt-3" />
        </div>

        {errore && <Alert variant="danger">{errore}</Alert>}

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner
              animation="border"
              style={{ color: "#EED972", width: "2.5rem", height: "2.5rem" }}
            />
          </div>
        ) : prenotazioni.length === 0 ? (
          <div
            className="text-center py-5 p-5 rounded-4 shadow-lg box-vuoto"
            style={{
              backdropFilter: "blur(16px)",
              border: "1px dashed rgba(255,255,255,0.12)",
            }}
          >
            <i
              className="bi bi-calendar-x display-4 mb-3 d-block"
              style={{ color: "#EED972", opacity: 0.8 }}
            ></i>
            <p className="text-light opacity-75 mb-4 fs-6">
              Non hai ancora effettuato alcuna prenotazione ai nostri
              laboratori.
            </p>
            <Button
              onClick={() => navigate("/laboratori")}
              className="border-0 px-4 py-3 fw-bold shadow-sm checkout-btn-gold"
            >
              <i className="bi bi-search me-2"></i> Scopri i Laboratori
            </Button>
          </div>
        ) : (
          <Row className="g-4">
            {prenotazioni.map((p, index) => {
              // Diamo priorità all'UUID perché il backend si aspetta un UUID nel path
              const idPrenotazione = p.uuid || p.id;
              const isCancellata = p.stato === "CANCELLATA";
              const fotoLab =
                p.laboratorio?.immagine ||
                p.laboratorio?.copertina ||
                p.laboratorio?.urlImmagine;

              return (
                <Col xs={12} key={idPrenotazione}>
                  <div
                    className="ordine-card prenotazione-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4"
                    style={{
                      animationDelay: `${index * 0.08}s`,
                      opacity: isCancellata ? 0.6 : 1,
                    }}
                  >
                    <div className="login-box-filo-oro" />
                    <div className="d-flex align-items-center gap-3">
                      {/* Miniatura Foto Copertina del Laboratorio */}
                      <div
                        className="rounded-3 overflow-hidden flex-shrink-0 shadow-sm"
                        style={{
                          width: "75px",
                          height: "75px",
                          border: "1px solid rgba(238, 217, 114, 0.3)",
                          backgroundColor: "rgba(0,0,0,0.3)",
                        }}
                      >
                        {fotoLab ? (
                          <img
                            src={fotoLab}
                            alt={p.laboratorio?.nome}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-warning">
                            <i className="bi bi-image fs-4"></i>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4
                          className="text-white fw-bold mb-2"
                          style={{
                            fontFamily: "'Roboto Serif', serif",
                            fontSize: "1.25rem",
                          }}
                        >
                          {p.laboratorio
                            ? p.laboratorio.nome
                            : "Laboratorio Antico Forno Matillo"}
                          {isCancellata && (
                            <span className="ms-2 badge bg-danger fs-6 align-middle">
                              Cancellata
                            </span>
                          )}
                        </h4>
                        <div className="d-flex flex-wrap gap-3 text-light opacity-85 small">
                          <span>
                            <i
                              className="bi bi-calendar3 me-1"
                              style={{ color: "#EED972" }}
                            ></i>{" "}
                            <strong className="text-white">{p.data}</strong>
                          </span>
                          {p.ora && (
                            <span>
                              <i
                                className="bi bi-clock me-1"
                                style={{ color: "#EED972" }}
                              ></i>{" "}
                              <strong className="text-white">{p.ora}</strong>
                            </span>
                          )}
                          <span>
                            <i
                              className="bi bi-people-fill me-1"
                              style={{ color: "#EED972" }}
                            ></i>{" "}
                            Partecipanti:{" "}
                            <strong style={{ color: "#EED972" }}>
                              {p.numeroPersone}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottoni Azione (Modifica e Elimina) */}
                    {!isCancellata && (
                      <div className="d-flex align-items-center gap-2 align-self-start align-self-md-center">
                        <Button
                          onClick={() => handleApriModifica(p)}
                          className="px-3 py-2 fw-semibold border-0 shadow-sm d-flex align-items-center gap-1"
                          style={{
                            backgroundColor: "rgba(238, 217, 114, 0.15)",
                            color: "#EED972",
                            borderRadius: "10px",
                            border: "1px solid rgba(238, 217, 114, 0.3)",
                            fontSize: "0.85rem",
                          }}
                        >
                          <i className="bi bi-pencil-square"></i> Modifica
                        </Button>
                        <Button
                          onClick={() =>
                            handleApriConfermaEliminazione(idPrenotazione)
                          }
                          className="px-3 py-2 fw-semibold border-0 shadow-sm d-flex align-items-center gap-1"
                          style={{
                            backgroundColor: "rgba(220, 53, 69, 0.15)",
                            color: "#ff6b6b",
                            borderRadius: "10px",
                            border: "1px solid rgba(220, 53, 69, 0.3)",
                            fontSize: "0.85rem",
                          }}
                        >
                          <i className="bi bi-trash-fill"></i> Elimina
                        </Button>
                      </div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Tasto Indietro in basso */}
        <div className="text-center mt-5">
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => navigate(-1)}
            className="d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 border-0 shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#EED972",
              backdropFilter: "blur(10px)",
            }}
          >
            <i className="bi bi-arrow-left"></i> <strong>Indietro</strong>
          </Button>
        </div>
      </Container>

      {/* Modale di Modifica con Sfondo Solido */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <div className="modal-box-solido p-4 shadow-lg">
          <div className="login-box-filo-oro" />

          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(238, 217, 114, 0.15)",
                color: "#EED972",
              }}
            >
              <i className="bi bi-people-fill fs-5"></i>
            </div>
            <div>
              <h4
                className="fw-bold mb-0 text-white"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: "1.3rem",
                }}
              >
                Modifica Partecipanti
              </h4>
              <p className="small text-light opacity-75 mb-0">
                Aggiorna il numero di persone per la tua prenotazione.
              </p>
            </div>
          </div>

          <Form onSubmit={handleSalvaModifica} className="mt-4">
            <Form.Group className="mb-4">
              <Form.Label className="small text-light fw-semibold">
                Numero Persone
              </Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={maxConsentito}
                value={numeroPersone}
                onChange={(e) => setNumeroPersone(e.target.value)}
                required
                className="checkout-input custom-input py-2"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "#fff",
                }}
              />
              <Form.Text
                className="text-light opacity-75 mt-1 d-block"
                style={{ fontSize: "0.8rem" }}
              >
                Posti liberi rimasti nel laboratorio:{" "}
                {prenotazioneSelezionata?.laboratorio?.postiDisponibili}{" "}
                (Massimo consentito: {maxConsentito})
              </Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="border-0 bg-transparent text-light shadow-none px-3"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                className="px-4 fw-bold border-0 shadow-sm d-flex align-items-center gap-2 checkout-btn-gold"
              >
                <i className="bi bi-check-lg"></i> Salva Modifiche
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modale di Conferma Eliminazione Personalizzato */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <div className="modal-box-solido p-4 shadow-lg">
          <div className="login-box-filo-oro" />

          <div className="d-flex align-items-center gap-3 mb-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-3"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "rgba(220, 53, 69, 0.15)",
                color: "#ff6b6b",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
            </div>
            <div>
              <h4
                className="fw-bold mb-0 text-white"
                style={{
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: "1.3rem",
                }}
              >
                Conferma Eliminazione
              </h4>
              <p className="small text-light opacity-75 mb-0">
                Questa azione annullerà la prenotazione.
              </p>
            </div>
          </div>

          <p className="text-light my-3" style={{ fontSize: "0.95rem" }}>
            Sei sicura di voler cancellare questa prenotazione?
          </p>

          <div className="d-flex justify-content-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              className="border-0 bg-transparent text-light shadow-none px-3"
            >
              Annulla
            </Button>
            <Button
              onClick={handleConfermaEliminazione}
              className="px-4 fw-bold border-0 shadow-sm d-flex align-items-center gap-2"
              style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                borderRadius: "10px",
              }}
            >
              <i className="bi bi-trash-fill"></i> Conferma ed Elimina
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default LeMiePrenotazioni;
