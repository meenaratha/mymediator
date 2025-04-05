import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices

const HouseSaleFormPage = () => {
  return (
    <>
      <HeroSection tittle="Sale ( Houses & Apartment )" />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
              <HouseSaleForm />
            </div>
    </>
  )
}

export default HouseSaleFormPage
