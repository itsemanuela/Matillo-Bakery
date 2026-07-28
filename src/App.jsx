import "./App.css";
import Hero from "./Components/Hero";
import MyNavbar from "./Components/MyNavbar";

function App() {
  return (
    <>
      <MyNavbar />
      <Hero />
      <div className="hero-banner"></div>
    </>
  );
}

export default App;
