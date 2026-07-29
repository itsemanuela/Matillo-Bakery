import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Hero from "./Components/Hero";
import AboutSection from "./Components/AboutSection";
import MyFooter from "./Components/MyFooter";
import MyNavbar from "./Components/MyNavbar";

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
      </Routes>

      <MyFooter />
    </BrowserRouter>
  );
}

export default App;
