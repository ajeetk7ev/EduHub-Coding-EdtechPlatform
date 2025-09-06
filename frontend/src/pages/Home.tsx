import Footer from '@/components/footer/Footer'
import Navbar from '@/components/header/Navbar'
import BecomeInstructor from '@/components/home/BecomeInstructor'
import CTA from '@/components/home/CTA'
import FeaturedCourses from '@/components/home/FeaturedCourses'
import HeroSection from '@/components/home/HeroSection'
import Testimonials from '@/components/home/Testimonials'
import WhyChoose from '@/components/home/WhyChoose'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'


function Home() {
  const {loadUser} = useAuthStore();

  useEffect(() => {
     loadUser();
  },[])
  return (
    <div>
        <Navbar/>
        <HeroSection/>
        <FeaturedCourses/>
        <WhyChoose/>
        <Testimonials/>
        <BecomeInstructor/>
        <CTA/>
        <Footer/>
    </div>
  )
}

export default Home