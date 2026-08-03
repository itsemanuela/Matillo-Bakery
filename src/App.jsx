import "./App.css";
<<<<<<< Updated upstream

function App() {
  return <></>;
=======
import Hero from "./Components/Hero";
import AboutSection from "./Components/AboutSection";
import MyFooter from "./Components/MyFooter";
import MyNavbar from "./Components/MyNavbar";
import MyShop from "./Components/MyShop";
import Checkout from "./Components/Checkout";
import Admin from "./ComponentGestionale/Admin";

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
        <Route path="/admin/prodotti" element={<Admin />} />
      </Routes>

      <MyFooter />
    </BrowserRouter>
  );
>>>>>>> Stashed changes
}

export default App;
