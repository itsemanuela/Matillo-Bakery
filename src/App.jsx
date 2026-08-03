import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />

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
      </Routes>

      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
