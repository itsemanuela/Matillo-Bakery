import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Hero from "./Components/Hero";
import AboutSection from "./Components/AboutSection";
import MyFooter from "./Components/MyFooter";
import MyNavbar from "./Components/MyNavbar";
import MyShop from "./Components/MyShop";
import Checkout from "./Components/Checkout";

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
      </Routes>

      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
