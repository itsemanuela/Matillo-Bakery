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
import MyOrdini from "./Components/MyOrdini";
import AdminNavbar from "./ComponentGestionale/AdminNavbar";
import AdminOrdini from "./ComponentGestionale/AdminOrdini";
import AdminShopPreview from "./ComponentGestionale/AdminShopPreview";
import AdminLaboratori from "./ComponentGestionale/AdminLaboratori";
import Laboratori from "./Components/Laboratori";
import LaboratorioDettaglio from "./Components/LaboratorioDettaglio";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <MyNavbar />}

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
        <Route path="/login" element={<Login />} />
        <Route path="/miei-ordini" element={<MyOrdini />} />
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
        <Route path="/laboratori" element={<Laboratori />} />
        <Route path="/laboratori/:id" element={<LaboratorioDettaglio />} />
      </Routes>

      {!isAdminRoute && <MyFooter />}
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
