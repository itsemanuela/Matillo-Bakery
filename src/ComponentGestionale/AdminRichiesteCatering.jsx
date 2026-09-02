import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

const COLORE_STATO = {
  IN_ATTESA: "#b89728",
  CONTATTATO: "#3675a3",
  CONFERMATA: "#2e7d43",
  ANNULLATA: "#c94a4a",
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function AdminRichiesteCatering() {
  const [richieste, setRichieste] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [errore, setErrore] = useState(null);

  const caricaRichieste = (mostraCaricamento = true) => {
    if (mostraCaricamento) setCaricamento(true);
    fetch(`${API_URL}/richieste-catering`, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel caricamento delle richieste");
        return res.json();
      })
      .then((data) => {
        const ordinate = [...data].sort(
          (a, b) => new Date(b.dataRichiesta) - new Date(a.dataRichiesta),
        );
        setRichieste(ordinate);
        setCaricamento(false);
      })
      .catch((err) => {
        setErrore(err.message);
        setCaricamento(false);
      });
  };

  useEffect(() => {
    caricaRichieste(false);
  }, []);

  const cambiaStato = (id, nuovoStato) => {
    fetch(`${API_URL}/richieste-catering/${id}/stato`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ stato: nuovoStato }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Errore durante l'aggiornamento");
        caricaRichieste(false);
      })
      .catch((err) => setErrore(err.message));
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        color: "#212529",
        minHeight: "100vh",
        paddingTop: "130px",
        paddingBottom: "80px",
      }}
    >
      <style>{`
        .admin-table thead th {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1.5px;
          color: #495057;
          font-weight: 700;
          background-color: #e9ecef !important;
          border-bottom: 2px solid #dee2e6 !important;
        }
        .admin-table tbody tr:hover {
          background-color: rgba(164, 108, 82, 0.04) !important;
        }
        .stato-select {
          background-color: #ffffff;
          border: 1px solid #ced4da;
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .stato-select:focus {
          border-color: #a46c52;
          box-shadow: 0 0 0 0.2rem rgba(164, 108, 82, 0.15);
        }
      `}</style>
      <Container>
        <h1
          className="fw-bold mb-4 text-dark"
          style={{ fontFamily: "'Roboto Serif', serif" }}
        >
          Richieste Catering
        </h1>

        {errore && <Alert variant="danger">{errore}</Alert>}

        {caricamento ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#a46c52" }} />
          </div>
        ) : richieste.length === 0 ? (
          <p className="text-muted">Nessuna richiesta ricevuta.</p>
        ) : (
          <div
            className="bg-white shadow-sm"
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e9ecef",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <Table responsive hover className="admin-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Data richiesta</th>
                    <th>Cliente</th>
                    <th>Pacchetto</th>
                    <th>Evento</th>
                    <th>Persone</th>
                    <th>Contatti</th>
                    <th className="pe-4">Stato</th>
                  </tr>
                </thead>
                <tbody>
                  {richieste.map((r) => (
                    <tr key={r.uuid}>
                      <td className="small ps-4">
                        {new Date(r.dataRichiesta).toLocaleDateString("it-IT")}
                      </td>
                      <td className="fw-semibold text-dark">
                        {r.nomeCliente} {r.cognomeCliente}
                      </td>
                      <td>{r.pacchetto.nome}</td>
                      <td className="small">
                        {new Date(r.dataEvento).toLocaleDateString("it-IT")}
                      </td>
                      <td>{r.numeroPersone}</td>
                      <td className="small">
                        <div>{r.emailCliente}</div>
                        <div className="text-muted">{r.telefonoCliente}</div>
                      </td>
                      <td className="pe-4">
                        <Form.Select
                          className="stato-select"
                          value={r.stato}
                          onChange={(e) => cambiaStato(r.uuid, e.target.value)}
                          style={{ color: COLORE_STATO[r.stato] }}
                        >
                          <option value="IN_ATTESA">In attesa</option>
                          <option value="CONTATTATO">Contattato</option>
                          <option value="CONFERMATA">Confermata</option>
                          <option value="ANNULLATA">Annullata</option>
                        </Form.Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default AdminRichiesteCatering;
