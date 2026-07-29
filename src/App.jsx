import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./Components/Hero";
import MyFooter from "./Components/MyFooter";
import MyNavbar from "./Components/MyNavbar";

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Hero />} />
        </Routes>

        <div className="hero-banner"></div>
        <MyFooter />
      </BrowserRouter>
    </>
  );
}

export default App;
