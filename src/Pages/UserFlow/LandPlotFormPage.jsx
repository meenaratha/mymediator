import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import LandPlotForm from "../../features/LandPlotForm";

const LandPlotFormPage = () => {
  return (
    <>
        <HeroSection tittle="Land & Plot" />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
             <LandPlotForm />
            </div>
    </>
  )
}

export default LandPlotFormPage

