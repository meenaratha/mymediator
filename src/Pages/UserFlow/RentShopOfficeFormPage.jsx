
import { HeroSection, HouseSaleForm } from "@/components";
import { useMediaQuery } from "react-responsive"; // For detecting mobile devices
import RentShopOfficeForm from "../../features/RentShopOfficeForm";
const RentShopOfficeFormPage = () => {
  return (
    <>
       <HeroSection tittle="Rent ( Shop & Office ) " />
            <div className="max-w-screen-xl max-w-[1200px] mx-auto px-4 py-12">
         <RentShopOfficeForm />
            </div>
    </>
  )
}

export default RentShopOfficeFormPage
