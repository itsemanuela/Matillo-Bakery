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
import AdminNavbar from "./ComponentGestionale/AdminNavbar";
import AdminOrdini from "./ComponentGestionale/AdminOrdini";
import AdminShopPreview from "./ComponentGestionale/AdminShopPreview";

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
