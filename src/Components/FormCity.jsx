import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";

const COMUNI_URL =
  "https://cdn.jsdelivr.net/gh/matteocontrini/comuni-json/comuni.json";

let comuniCache = null;

function caricaComuni() {
  if (comuniCache) return Promise.resolve(comuniCache);
  return fetch(COMUNI_URL)
    .then((res) => res.json())
    .then((data) => {
      comuniCache = data;
      return data;
    });
}

function FormCity({ name, value, onChange, className, required, placeholder }) {
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [mostraSuggerimenti, setMostraSuggerimenti] = useState(false);
  const [comuni, setComuni] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    caricaComuni().then(setComuni);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMostraSuggerimenti(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e);

    const testo = e.target.value.trim().toLowerCase();
    if (!comuni || testo.length < 2) {
      setSuggerimenti([]);
      return;
    }

    const filtrati = comuni
      .filter((c) => c.nome.toLowerCase().startsWith(testo))
      .slice(0, 8); // massimo 8 suggerimenti

    setSuggerimenti(filtrati);
    setMostraSuggerimenti(filtrati.length > 0);
  };

  const handleSelezione = (nomeComune) => {
    onChange({ target: { name, value: nomeComune, type: "text" } });
    setMostraSuggerimenti(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <Form.Control
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggerimenti.length > 0 && setMostraSuggerimenti(true)}
        className={className}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
      />

      {mostraSuggerimenti && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#2a1f18",
            border: "1px solid rgba(238, 217, 114, 0.3)",
            borderRadius: "10px",
            marginTop: "4px",
            maxHeight: "220px",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          }}
        >
          {suggerimenti.map((c) => (
            <div
              key={`${c.nome}-${c.sigla}`}
              onClick={() => handleSelezione(c.nome)}
              className="px-3 py-2"
              style={{
                cursor: "pointer",
                color: "#f8f9fa",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(238,217,114,0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {c.nome}{" "}
              <span style={{ color: "#EED972", fontSize: "0.8rem" }}>
                ({c.sigla})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormCity;
