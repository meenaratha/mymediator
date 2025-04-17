import UploadCarForm from "../features/UploadCarForm"
import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
const UploadCarFormPage = () => {
  return (
    <>
       <HeroSection tittle="Upload Car" />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <UploadCarForm/>
            </div>
    </>
  )
}

export default UploadCarFormPage
