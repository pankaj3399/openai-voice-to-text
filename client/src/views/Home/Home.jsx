import Footer from "../../components/shared/Footer"
import Navbar from "../../components/shared/Navbar"
import Aanpak from "./componets/Aanpak"
import Banner from "./componets/Banner"
import Contact from "./componets/Contact"

import '../../styles/normalize.css'
import '../../styles/webflow.css'
import '../../styles/tims.css'
import '../../styles/landing-main.css'

import Voordelen from "./componets/Voordelen"
import Ervaringen from "./componets/Ervaringen"
import Faq from "./componets/Faq"

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Home = () => {

  useEffect(()=>{
    AOS.init({
      // once: true,
    })
    AOS.refresh();

  },[])
  return (
    <>

      <Navbar />

      <Banner />

      <Aanpak />

      <Voordelen />

      <Ervaringen />

      <Faq />

      <Contact />

      <Footer />
    </ >
  )
}

export default Home