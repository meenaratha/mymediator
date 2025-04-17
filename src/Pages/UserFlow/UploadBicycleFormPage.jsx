import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import UploadBicycleForm from "../../features/UploadBicycleForm";
const UploadBicycleFormPage = () => {
  return (
    <>
       <HeroSection tittle="Sale ( Shop & Office ) " />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <UploadBicycleForm/>
            </div>
    </>
  )
}

export default UploadBicycleFormPage
