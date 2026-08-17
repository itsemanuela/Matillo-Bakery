import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Hero from "./Components/Hero";
import AboutSection from "./Components/AboutSection";
import MyFooter from "./Components/MyFooter";
import MyNavbar from "./Components/MyNavbar";
import MyShop from "./Components/MyShop";
import Checkout from "./Components/Checkout";
import Admin from "./ComponentGestionale/Admin";
import RequiredAdmin from "./ComponentGestionale/RequiredAdmin";
import Login from "./ComponentGestionale/Login";
import AccessoGenerale from "./Components/AccessoGenerale";
import MyOrdini from "./Components/MyOrdini";
import AdminNavbar from "./ComponentGestionale/AdminNavbar";
import AdminOrdini from "./ComponentGestionale/AdminOrdini";
import AdminShopPreview from "./ComponentGestionale/AdminShopPreview";
import AdminLaboratori from "./ComponentGestionale/AdminLaboratori";
import AdminPrenotazioni from "./ComponentGestionale/AdminPrenotazioni";
import Laboratori from "./Components/Laboratori";
import LaboratorioDettaglio from "./Components/LaboratorioDettaglio";
import LeMiePrenotazioni from "./Components/LeMiePrenotazioni";
import Profilo from "./Components/Profilo";
import Catering from "./Components/Catering";
import CateringDettaglio from "./Components/CateringDettaglio";
import AdminCatering from "./ComponentGestionale/AdminCatering";
import AdminRichiesteCatering from "./ComponentGestionale/AdminRichiesteCatering";
import AdminGalleriaEventi from "./ComponentGestionale/AdminGalleriaEventi";
import ChatWidget from "./Components/ChatWidget";
import ResetPassword from "./Components/ResetPassword";
import CheckoutSuccesso from "./Components/CheckoutSuccesso";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <MyNavbar />}

      <style>{`
        @media (min-width: 992px) {
          .app-content-area.admin-shifted {
            margin-left: calc(var(--admin-sidebar-width, 264px) + 32px);
            transition: margin-left 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          }
        }
      `}</style>

      <div
        className={`app-content-area ${isAdminRoute ? "admin-shifted" : ""}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <AboutSection />
              </>
            }
          />
          <Route path="/shop" element={<MyShop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/successo" element={<CheckoutSuccesso />} />

          <Route path="/catering" element={<Catering />} />
          <Route path="/catering/:id" element={<CateringDettaglio />} />

          <Route path="/login" element={<Login />} />
          <Route path="/accedi" element={<AccessoGenerale />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/miei-ordini" element={<MyOrdini />} />
          <Route path="/le-mie-prenotazioni" element={<LeMiePrenotazioni />} />
          <Route path="/profilo" element={<Profilo />} />

          <Route
            path="/admin/prodotti"
            element={
              <RequiredAdmin>
                <Admin />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/ordini"
            element={
              <RequiredAdmin>
                <AdminOrdini />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/shop-preview"
            element={
              <RequiredAdmin>
                <AdminShopPreview />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/laboratori"
            element={
              <RequiredAdmin>
                <AdminLaboratori />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/prenotazioni"
            element={
              <RequiredAdmin>
                <AdminPrenotazioni />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/catering"
            element={
              <RequiredAdmin>
                <AdminCatering />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/richieste-catering"
            element={
              <RequiredAdmin>
                <AdminRichiesteCatering />
              </RequiredAdmin>
            }
          />
          <Route
            path="/admin/galleria-eventi"
            element={
              <RequiredAdmin>
                <AdminGalleriaEventi />
              </RequiredAdmin>
            }
          />

          <Route path="/laboratori" element={<Laboratori />} />
          <Route path="/laboratori/:id" element={<LaboratorioDettaglio />} />
        </Routes>
      </div>

      {!isAdminRoute && <MyFooter />}
      {!isAdminRoute && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
