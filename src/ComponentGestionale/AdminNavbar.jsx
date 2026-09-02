import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "https://matillo-digital-bakery-experience-be.onrender.com/api";

const GRUPPI = [
  {
    titolo: "Catalogo",
    voci: [{ path: "/admin/prodotti", label: "Prodotti", icon: "bi-basket3" }],
  },
  {
    titolo: "Vendite",
    voci: [
      {
        path: "/admin/ordini",
        label: "Ordini",
        icon: "bi-receipt",
        badgeKey: "ordini",
      },
    ],
  },
  {
    titolo: "Laboratori",
    voci: [
      {
        path: "/admin/laboratori",
        label: "Laboratori",
        icon: "bi-mortarboard",
      },
      {
        path: "/admin/prenotazioni",
        label: "Prenotazioni",
        icon: "bi-calendar-check",
      },
    ],
  },
  {
    titolo: "Catering",
    voci: [
      { path: "/admin/catering", label: "Catering", icon: "bi-cup-hot" },
      {
        path: "/admin/richieste-catering",
        label: "Richieste Catering",
        icon: "bi-envelope-paper",
      },
    ],
  },
  {
    titolo: "Contenuti",
    voci: [
      {
        path: "/admin/galleria-eventi",
        label: "Galleria Eventi",
        icon: "bi-images",
      },
    ],
  },
  {
    titolo: "Strumenti",
    voci: [
      { path: "/admin/shop-preview", label: "Anteprima Shop", icon: "bi-eye" },
    ],
  },
];

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [apertaSuMobile, setApertaSuMobile] = useState(false);
  const [collassata, setCollassata] = useState(
    () => localStorage.getItem("adminSidebarCollassata") === "true",
  );
  const [ordiniInAttesa, setOrdiniInAttesa] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--admin-sidebar-width",
      collassata ? "76px" : "264px",
    );
    localStorage.setItem("adminSidebarCollassata", collassata);
  }, [collassata]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/ordini`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((ordini) => {
        const inAttesa = ordini.filter(
          (o) => o.stato === "IN_ELABORAZIONE",
        ).length;
        setOrdiniInAttesa(inAttesa);
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utente");
    navigate("/login");
  };

  const vaiA = (path) => {
    navigate(path);
    setApertaSuMobile(false);
  };

  const badgeValori = { ordini: ordiniInAttesa };

  return (
    <>
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: var(--admin-sidebar-width, 264px);
          background: linear-gradient(160deg, #2b211a 0%, #1c1613 55%, #150f0d 100%);
          border-right: 1px solid rgba(0,0,0,0.4);
          box-shadow: 18px 0 45px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.04);
          display: flex;
          flex-direction: column;
          z-index: 1040;
          transition: width 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          overflow: hidden;
        }
        .admin-sidebar::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: radial-gradient(ellipse at top, rgba(238,217,114,0.14), transparent 70%);
          pointer-events: none;
        }
        .admin-sidebar-hairline {
          height: 2px;
          background: linear-gradient(90deg, transparent, #EED972, transparent);
          opacity: 0.6;
          flex-shrink: 0;
        }
        .admin-sidebar-toggle, .admin-sidebar-close, .admin-sidebar-backdrop {
          display: none;
        }
        .admin-collapse-btn {
          display: none;
        }
        .admin-group-title {
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a6f60;
          padding: 18px 22px 8px;
          white-space: nowrap;
        }
        .admin-nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 3px 14px;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid transparent;
          color: #b7ab9c;
          font-size: 0.94rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.18s ease, color 0.18s ease, transform 0.15s ease, border-color 0.18s ease;
        }
        .admin-nav-link:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.08);
          color: #F4F1EA;
          transform: translateY(-1px);
        }
        .admin-nav-link.active {
          background: linear-gradient(145deg, rgba(238,217,114,0.16), rgba(238,217,114,0.06));
          border-color: rgba(238,217,114,0.3);
          box-shadow: 0 4px 14px rgba(0,0,0,0.4), 0 0 0 1px rgba(238,217,114,0.08), inset 0 1px 0 rgba(255,255,255,0.08);
          transform: translateY(-1px);
          color: #EED972;
          font-weight: 700;
        }
        .admin-nav-link.active .admin-nav-icon {
          background: linear-gradient(145deg, #EED972, #c9a94a);
          color: #1c1613;
          box-shadow: 0 3px 8px rgba(238,217,114,0.35), inset 0 1px 0 rgba(255,255,255,0.4);
        }
        .admin-nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 10px;
          font-size: 0.92rem;
          flex-shrink: 0;
          background: linear-gradient(145deg, #2f241d, #191310);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.5), -1px -1px 3px rgba(255,255,255,0.04);
          color: inherit;
          transition: background 0.18s ease, box-shadow 0.18s ease;
        }
        .admin-nav-link.active .admin-nav-icon {
          background: rgba(238,217,114,0.18);
        }
        .admin-nav-badge {
          margin-left: auto;
          background: #EED972;
          color: #1c1613;
          font-size: 0.68rem;
          font-weight: 800;
          line-height: 1;
          padding: 3px 6px;
          border-radius: 999px;
          min-width: 18px;
          text-align: center;
        }
        .admin-nav-badge-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #EED972;
          border: 2px solid #1c1613;
        }
        .admin-label, .admin-group-title, .admin-brand-text, .admin-nav-badge {
          transition: opacity 0.15s ease;
        }
        .admin-sidebar.collassata .admin-label,
        .admin-sidebar.collassata .admin-group-title,
        .admin-sidebar.collassata .admin-brand-text,
        .admin-sidebar.collassata .admin-nav-badge {
          opacity: 0;
          width: 0;
          pointer-events: none;
        }
        .admin-sidebar.collassata .admin-nav-link {
          justify-content: center;
          margin: 2px 8px;
        }
        .admin-sidebar.collassata .admin-nav-link.active {
          position: relative;
        }
        .admin-sidebar.collassata .admin-nav-link.active::after {
          content: "";
          position: absolute;
          top: 6px;
          right: 6px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #EED972;
        }
        @media (min-width: 992px) {
          .admin-collapse-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            background: rgba(255,255,255,0.05);
            border: none;
            color: #b7ab9c;
            flex-shrink: 0;
            transition: background 0.18s ease, color 0.18s ease, transform 0.2s ease;
          }
          .admin-collapse-btn:hover {
            background: rgba(238,217,114,0.12);
            color: #EED972;
          }
          .admin-sidebar.collassata .admin-collapse-btn i {
            transform: rotate(180deg);
          }
        }
        @media (max-width: 991.98px) {
          .admin-sidebar {
            width: 264px !important;
            transform: translateX(-100%);
          }
          .admin-sidebar.aperta {
            transform: translateX(0);
            box-shadow: 8px 0 40px rgba(0,0,0,0.5);
          }
          .admin-sidebar-toggle {
            display: flex;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 1041;
            width: 42px;
            height: 42px;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background-color: rgba(24, 19, 16, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(238,217,114,0.3);
            color: #EED972;
          }
          .admin-sidebar-close {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(255,255,255,0.06);
            border: none;
            color: #EED972;
          }
          .admin-sidebar-backdrop.aperta {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            backdrop-filter: blur(2px);
            z-index: 1039;
          }
        }
      `}</style>

      <button
        className="admin-sidebar-toggle border-0"
        onClick={() => setApertaSuMobile(true)}
        aria-label="Apri il menu"
      >
        <i className="bi bi-list" style={{ fontSize: "1.4rem" }}></i>
      </button>

      <div
        className={`admin-sidebar-backdrop ${apertaSuMobile ? "aperta" : ""}`}
        onClick={() => setApertaSuMobile(false)}
      />

      <div
        className={`admin-sidebar ${apertaSuMobile ? "aperta" : ""} ${collassata ? "collassata" : ""}`}
      >
        <div className="admin-sidebar-hairline" />

        <div
          className="px-3 py-4 d-flex align-items-center justify-content-between"
          style={{ borderBottom: "1px solid rgba(238,217,114,0.1)" }}
        >
          <div
            onClick={() => vaiA("/admin/prodotti")}
            className="d-flex align-items-center gap-2"
            style={{ cursor: "pointer", overflow: "hidden" }}
          >
            <span
              style={{
                color: "#EED972",
                fontFamily: "'Roboto Serif', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              M
            </span>
            <span
              className="admin-brand-text"
              style={{
                color: "#EED972",
                fontFamily: "'Roboto Serif', serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              Gestionale · Matillo
            </span>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setApertaSuMobile(false)}
            aria-label="Chiudi il menu"
          >
            <i className="bi bi-x-lg" style={{ fontSize: "0.9rem" }}></i>
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto py-2">
          {GRUPPI.map((gruppo) => (
            <div key={gruppo.titolo}>
              <div className="admin-group-title">{gruppo.titolo}</div>
              {gruppo.voci.map((voce) => {
                const badge = voce.badgeKey ? badgeValori[voce.badgeKey] : 0;
                return (
                  <div
                    key={voce.path}
                    className={`admin-nav-link ${location.pathname === voce.path ? "active" : ""}`}
                    onClick={() => vaiA(voce.path)}
                    title={collassata ? voce.label : undefined}
                  >
                    <span className="admin-nav-icon">
                      <i className={`bi ${voce.icon}`}></i>
                    </span>
                    <span className="admin-label">{voce.label}</span>
                    {badge > 0 && (
                      <span className="admin-nav-badge">{badge}</span>
                    )}
                    {collassata && badge > 0 && (
                      <span className="admin-nav-badge-dot" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div
          className="p-3 d-flex flex-column gap-2"
          style={{ borderTop: "1px solid rgba(238,217,114,0.1)" }}
        >
          <button
            className="admin-collapse-btn"
            onClick={() => setCollassata((prev) => !prev)}
            aria-label={collassata ? "Espandi il menu" : "Comprimi il menu"}
          >
            <i
              className="bi bi-chevron-double-left"
              style={{ fontSize: "0.8rem" }}
            ></i>
          </button>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/")}
            className="text-decoration-none px-0 admin-label"
            style={{ color: "#b7ab9c", fontSize: "0.82rem" }}
          >
            <i className="bi bi-arrow-left me-2"></i>Torna al sito
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={handleLogout}
            className="w-100"
            style={{ borderRadius: "10px" }}
          >
            <span className="admin-label">Esci</span>
            <i
              className="bi bi-box-arrow-right d-none"
              style={{ display: collassata ? "inline" : "none" }}
            ></i>
          </Button>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
