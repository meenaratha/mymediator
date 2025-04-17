import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import UploadMotocycleForm from "../../features/UploadMotocycleForm";
const UploadMotercycleFormPage = () => {
  return (
    <>
      <HeroSection tittle="Upload Motercycle" />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <UploadMotocycleForm/>
            </div>
    </>
  )
}

export default UploadMotercycleFormPage
