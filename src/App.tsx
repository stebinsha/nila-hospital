import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/common/Header'
import HeroSection from './components/Hero/HeroSection'
import CategoriesSection from "./components/categories/CategoriesSection";
import CTASection from "./components/categories/CTASection";
import TherapistsPage from "./components/Therapist/TherapistsPage";
import FaqSection from "./components/QuesAnswer/FaqSection";
import Footer from "./components/common/Footer";
import './App.css'

function App() {
  return (
     <Router>
      <Routes>

        <Route
          path="/"
          element={
           <div className="pt-20">
              <Header/>
             <HeroSection/>
             <CategoriesSection/>
             <CTASection/>
             <TherapistsPage/>
             <FaqSection/>
             <Footer/>
            </div>
          }
        />
  </Routes>
  </Router>
  )
}

export default App
