import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Weather from "../components/Weather"
import HowItWorks from "../components/HowItWorks"
import Footer from "../components/Footer"



function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Weather />
      <HowItWorks />
      <Footer />
      {/* Features, Footer will come later */}
    </>
  )
}

export default Home