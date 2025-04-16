import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import UploadElectronicsForm from "../../features/UploadElectronicsForm";
const UploadElectronicFormPage = () => {
  return (
    <>
     <HeroSection tittle="Upload Electronics" />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <UploadElectronicsForm/>
            </div>
      
    </>
  )
}

export default UploadElectronicFormPage
